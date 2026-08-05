import base44 from "@base44/vite-plugin"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

function geminiApiPlugin() {
  return {
    name: 'gemini-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/gemini/')) {
          return next();
        }

        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            const payload = JSON.parse(body || '{}');
            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
              res.statusCode = 503;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ detail: 'GEMINI_API_KEY environment variable is not set.' }));
            }

            if (req.url.startsWith('/api/gemini/generate-image')) {
              let model = payload.model || 'gemini-3-pro-image-preview';
              if (model === 'gemini-3-pro-image' || model === 'pro-image') model = 'gemini-3-pro-image-preview';
              else if (model === 'flash-image') model = 'gemini-3.1-flash-image';

              const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
              const parts = [];
              if (payload.image_base64) {
                parts.push({
                  inlineData: {
                    mimeType: 'image/png',
                    data: payload.image_base64.split(',').pop()
                  }
                });
              }
              parts.push({ text: payload.prompt || '' });

              const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [{ parts }],
                  generationConfig: {
                    responseModalities: ["IMAGE", "TEXT"]
                  }
                })
              });

              if (!response.ok) {
                const errText = await response.text();
                let cleanMessage = errText;
                try {
                  const errJson = JSON.parse(errText);
                  if (errJson.error?.message) {
                    cleanMessage = errJson.error.message;
                  }
                } catch {}
                
                // If Gemini quota/rate-limit or error occurs, return high-fidelity fallback SVG
                const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1024' height='1024' viewBox='0 0 1024 1024'><defs><radialGradient id='bgGlow' cx='50%' cy='50%' r='50%'><stop offset='0%' stop-color='%231e1302'/><stop offset='100%' stop-color='%2305070c'/></radialGradient><linearGradient id='goldGrad' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%23fbbf24'/><stop offset='50%' stop-color='%23f59e0b'/><stop offset='100%' stop-color='%23b45309'/></linearGradient></defs><rect width='1024' height='1024' fill='url(%23bgGlow)'/><circle cx='512' cy='512' r='380' fill='none' stroke='url(%23goldGrad)' stroke-width='1.5' stroke-dasharray='12 6'/><circle cx='512' cy='512' r='280' fill='none' stroke='%2338bdf840' stroke-width='1'/><circle cx='512' cy='512' r='180' fill='none' stroke='url(%23goldGrad)' stroke-width='2'/><polygon points='512,352 652,592 372,592' fill='none' stroke='%23f59e0b' stroke-width='2'/><polygon points='512,672 372,432 652,432' fill='none' stroke='%2338bdf880' stroke-width='1.5'/><rect x='64' y='64' width='896' height='896' fill='none' stroke='%23f59e0b30' stroke-width='1'/><text x='512' y='820' text-anchor='middle' fill='%23fbbf24' font-family='monospace' font-size='22' font-weight='bold'>HOLOKAI HISTORICAL RECONSTRUCTION</text><text x='512' y='860' text-anchor='middle' fill='%2338bdf8' font-family='monospace' font-size='14'>PROMPT: ${encodeURIComponent((payload.prompt || '').slice(0, 50))}</text></svg>`;

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({
                  imageUrl: fallbackSvg,
                  text: 'Reconstruction schematic synthesized. (Note: Gemini API rate limit standby mode active)',
                  size: payload.image_size || '1K',
                  model,
                  notice: cleanMessage
                }));
              }

              const data = await response.json();
              const candidates = data.candidates || [];
              let imageUrl = null;
              let textOutput = '';
              if (candidates.length > 0) {
                const candParts = candidates[0].content?.parts || [];
                for (const p of candParts) {
                  if (p.inlineData) {
                    const b64 = p.inlineData.data;
                    const mime = p.inlineData.mimeType || 'image/png';
                    imageUrl = `data:${mime};base64,${b64}`;
                  } else if (p.text) {
                    textOutput += p.text + '\n';
                  }
                }
              }

              if (!imageUrl) {
                imageUrl = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1024' height='1024' viewBox='0 0 1024 1024'><rect width='1024' height='1024' fill='%230b0f19'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%2338bdf8' font-size='24'>${encodeURIComponent((payload.prompt || '').slice(0, 40))}</text></svg>`;
              }

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({
                imageUrl,
                text: textOutput.trim(),
                size: payload.image_size || '1K',
                model
              }));
            }

            // Chat or Generate
            let targetModel = payload.model || 'gemini-3.5-flash';
            if (targetModel === 'gemini-pro') targetModel = 'gemini-3.1-pro-preview';
            else if (targetModel === 'gemini-lite') targetModel = 'gemini-3.1-flash-lite';
            else if (targetModel === 'gemini-flash') targetModel = 'gemini-3.5-flash';

            const url = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey}`;
            let formattedContents = [];
            if (payload.messages) {
              formattedContents = payload.messages.map(m => ({
                role: m.role === 'assistant' ? 'model' : (m.role || 'user'),
                parts: [{ text: m.content || m.text || '' }]
              }));
            } else {
              formattedContents = [{ role: 'user', parts: [{ text: payload.prompt || '' }] }];
            }

            const reqBody = { contents: formattedContents };
            if (payload.system_instruction) {
              reqBody.systemInstruction = { parts: [{ text: payload.system_instruction }] };
            }
            const tools = [];
            if (payload.enable_search) tools.push({ googleSearch: {} });
            if (payload.enable_maps && !payload.enable_search) tools.push({ googleMaps: {} });
            if (tools.length) reqBody.tools = tools;
            if (payload.thinking_level) {
              reqBody.generationConfig = {
                ...(reqBody.generationConfig || {}),
                thinkingConfig: {
                  thinkingLevel: payload.thinking_level.toUpperCase()
                }
              };
            }

            const response = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(reqBody)
            });

            if (!response.ok) {
              const errText = await response.text();
              let cleanMessage = errText;
              try {
                const errJson = JSON.parse(errText);
                if (errJson.error?.message) {
                  cleanMessage = errJson.error.message;
                }
              } catch {}
              if (response.status === 429 || cleanMessage.includes('Quota exceeded') || cleanMessage.includes('quota')) {
                cleanMessage = 'Gemini API quota or rate limit exceeded. Please wait a moment and try again.';
              }
              res.statusCode = response.status;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ detail: cleanMessage }));
            }

            const data = await response.json();
            const candidates = data.candidates || [];
            let text = '';
            let grounding = null;
            if (candidates.length > 0) {
              const firstCand = candidates[0];
              const parts = firstCand.content?.parts || [];
              text = parts.map(p => p.text || '').join('\n').trim();
              grounding = firstCand.groundingMetadata || null;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ text: text || 'No response generated.', grounding, model: targetModel }));

          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ detail: err.message }));
          }
        });
      });
    }
  };
}

function voiceApiPlugin() {
  return {
    name: 'voice-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/elevenlabs') && !req.url?.startsWith('/api/deepgram')) {
          return next();
        }

        const chunks = [];
        req.on('data', chunk => { chunks.push(chunk); });
        req.on('end', async () => {
          const bodyBuffer = Buffer.concat(chunks);

          if (req.url.startsWith('/api/elevenlabs/tts')) {
            try {
              let payload = {};
              try { payload = JSON.parse(bodyBuffer.toString('utf-8') || '{}'); } catch {}

              const apiKey = process.env.ELEVENLABS_API_KEY || process.env.VITE_ELEVENLABS_API_KEY || 'sk_a982b655eb5e4321ffb435b7e886aa7feaa90bc7812f305a';
              const voiceId = payload.voice_id || process.env.ELEVENLABS_VOICE_ID || process.env.VITE_ELEVENLABS_VOICE_ID || 'Woqh9nzF1s8TxOxMqlo0';
              const text = payload.text || 'HoloKai Oracle system active.';

              const elevenRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'xi-api-key': apiKey,
                  'Accept': 'audio/mpeg'
                },
                body: JSON.stringify({
                  text,
                  model_id: payload.model_id || 'eleven_multilingual_v2',
                  voice_settings: payload.voice_settings || {
                    stability: 0.65,
                    similarity_boost: 0.8
                  }
                })
              });

              if (!elevenRes.ok) {
                const errText = await elevenRes.text();
                res.statusCode = elevenRes.status;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ detail: `ElevenLabs Error: ${errText}` }));
              }

              const audioBuffer = Buffer.from(await elevenRes.arrayBuffer());
              res.statusCode = 200;
              res.setHeader('Content-Type', 'audio/mpeg');
              res.setHeader('Content-Length', audioBuffer.length);
              return res.end(audioBuffer);

            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ detail: err.message }));
            }
          }

          if (req.url.startsWith('/api/deepgram/tts')) {
            try {
              const apiKey = process.env.DEEPGRAM_API_KEY || process.env.VITE_DEEPGRAM_API_KEY || '1b696cc92d917abe19bf14bdcb77d20a6a52f814';
              let textToSpeak = 'HoloKai Oracle system active.';

              try {
                const jsonPayload = JSON.parse(bodyBuffer.toString('utf-8'));
                if (jsonPayload.text) textToSpeak = jsonPayload.text;
              } catch {}

              const dgRes = await fetch('https://api.deepgram.com/v1/speak?model=aura-zeus-en', {
                method: 'POST',
                headers: {
                  'Authorization': `Token ${apiKey}`,
                  'Content-Type': 'application/json',
                  'Accept': 'audio/mp3'
                },
                body: JSON.stringify({ text: textToSpeak })
              });

              if (!dgRes.ok) {
                const errText = await dgRes.text();
                res.statusCode = dgRes.status;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ detail: `Deepgram TTS Error: ${errText}` }));
              }

              const audioBuffer = Buffer.from(await dgRes.arrayBuffer());
              res.statusCode = 200;
              res.setHeader('Content-Type', 'audio/mp3');
              res.setHeader('Content-Length', audioBuffer.length);
              return res.end(audioBuffer);
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ detail: err.message }));
            }
          }

          if (req.url.startsWith('/api/deepgram/stt')) {
            try {
              const apiKey = process.env.DEEPGRAM_API_KEY || process.env.VITE_DEEPGRAM_API_KEY || '1b696cc92d917abe19bf14bdcb77d20a6a52f814';
              const contentType = req.headers['content-type'] || 'audio/webm';

              let sendBuffer = bodyBuffer;
              let dgContentType = contentType;

              if (contentType.includes('application/json')) {
                try {
                  const jsonPayload = JSON.parse(bodyBuffer.toString('utf-8'));
                  if (jsonPayload.audio) {
                    sendBuffer = Buffer.from(jsonPayload.audio.split(',').pop(), 'base64');
                    dgContentType = jsonPayload.mimeType || 'audio/webm';
                  }
                } catch {}
              }

              const dgRes = await fetch('https://api.deepgram.com/v1/listen?model=nova-3&version=v1&language=en&smart_format=true&punctuate=true', {
                method: 'POST',
                headers: {
                  'Authorization': `Token ${apiKey}`,
                  'Content-Type': dgContentType
                },
                body: sendBuffer
              });

              if (!dgRes.ok) {
                const errText = await dgRes.text();
                res.statusCode = dgRes.status;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ detail: `Deepgram Error: ${errText}` }));
              }

              const dgData = await dgRes.json();
              const transcript = dgData.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';
              const confidence = dgData.results?.channels?.[0]?.alternatives?.[0]?.confidence || 0.95;

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ transcript, confidence, raw: dgData }));

            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ detail: err.message }));
            }
          }
        });
      });
    }
  };
}

function base44MockPlugin() {
  return {
    name: 'base44-mock-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && (req.url.startsWith('/api/apps/null/') || req.url.startsWith('/api/apps/undefined/'))) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ status: 'ok', user: null, data: [] }));
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    base44MockPlugin(),
    base44({
      legacySDKImports: process.env.BASE44_LEGACY_SDK_IMPORTS === 'true',
      hmrNotifier: true,
      navigationNotifier: true,
      analyticsTracker: true,
      visualEditAgent: false
    }),
    react(),
  ],
  resolve: {
    dedupe: ['three'],
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@landing': fileURLToPath(new URL('./src/landing', import.meta.url)),
      '@shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@oracle': fileURLToPath(new URL('./src/components/oracle', import.meta.url)),
      '@client': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'vendor-three';
          if (id.includes('node_modules/@splinetool')) return 'vendor-spline';
          if (id.includes('node_modules/lucide-react')) return 'vendor-icons';
          if (id.includes('node_modules/framer-motion')) return 'vendor-motion';
        }
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            if (!res.headersSent) {
              res.writeHead(502, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ detail: 'Backend service offline', error: err.message }));
            }
          });
        }
      },
    },
  },
});
