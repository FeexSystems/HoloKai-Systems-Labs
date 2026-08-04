import { getApiBase } from './holokaiApi';

/**
 * Robust Gemini API client supporting backend proxying, direct client fallback via VITE_GEMINI_API_KEY,
 * and graceful fallback synthesis when offline.
 */
export async function callGeminiApi(endpoint = '/api/gemini/chat', payload = {}) {
  const base = getApiBase();
  const apiEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // 1. Attempt backend server / Vite proxy endpoint
  try {
    const res = await fetch(`${base}${apiEndpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn(`[HoloKai Gemini API] Endpoint ${apiEndpoint} unreachable on backend, attempting direct client execution:`, err);
  }

  // 2. Direct client fallback using VITE_GEMINI_API_KEY
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process?.env?.GEMINI_API_KEY : '');

  if (apiKey) {
    try {
      let model = payload.model || 'gemini-2.0-flash';
      if (model === 'gemini-pro' || model === 'gemini-3.1-pro-preview') model = 'gemini-1.5-pro';
      else if (model === 'gemini-flash' || model === 'gemini-3.5-flash') model = 'gemini-2.0-flash';

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      let contents = [];
      if (payload.messages) {
        contents = payload.messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : (m.role || 'user'),
          parts: [{ text: m.content || m.text || '' }]
        }));
      } else {
        contents = [{ role: 'user', parts: [{ text: payload.prompt || '' }] }];
      }

      const reqBody = { contents };
      if (payload.system_instruction) {
        reqBody.systemInstruction = { parts: [{ text: payload.system_instruction }] };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqBody)
      });

      if (response.ok) {
        const data = await response.json();
        const candidate = data.candidates?.[0];
        const text = candidate?.content?.parts?.map(p => p.text || '').join('\n').trim();
        return {
          text: text || 'Knowledge synthesis complete.',
          grounding: candidate?.groundingMetadata || null,
          model
        };
      }
    } catch (err) {
      console.error('[HoloKai Gemini API] Direct client API call failed:', err);
    }
  }

  // 3. Graceful offline / unconfigured standby response
  return {
    text: "Jambo! The HoloKai Civilization Oracle is active in Standby Mode. To connect live neural synthesis, please configure `VITE_GEMINI_API_KEY` or `VITE_API_BASE_URL` in your deployment environment settings.",
    grounding: null,
    model: payload.model || 'holokai-oracle-standby'
  };
}
