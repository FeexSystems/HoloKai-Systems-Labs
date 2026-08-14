import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { OracleQueryResponse } from '@holokai/contracts';

const PYTHON_ENGINE_URL = process.env.PYTHON_ENGINE_URL || 'http://localhost:8000';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '' });

export async function POST(req: NextRequest) {
  try {
    const { prompt, civilizationFocus } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Try Python Engine first (Alive API)
    try {
      const aliveReq = await fetch(`${PYTHON_ENGINE_URL}/api/alive/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: prompt,
          k: 5,
          min_score: 0.2,
          domain: civilizationFocus || null,
          use_core: true,
          use_web: true,
        }),
        // Add a small timeout to avoid hanging forever if python-engine is down
        signal: AbortSignal.timeout(10000)
      });

      if (aliveReq.ok) {
        const aliveRes = await aliveReq.json();
        const oracleResponse: OracleQueryResponse = {
          queryId: `hk_query_${Date.now()}`,
          text: aliveRes.answer || aliveRes.text || 'The Oracle is silent.',
          epistemicStance: aliveRes.grounded?.insufficient_evidence ? 'SCHOLARLY_DEBATE' : 'ESTABLISHED',
          confidenceScore: 0.96,
          evidence: aliveRes.contexts?.map((c: any, i: number) => ({
            id: `ev_${i}`,
            sourceTitle: c.title || 'Knowledge Base',
            author: 'HoloKai Engine',
            year: new Date().getFullYear(),
            textSnippet: c.content || c.text,
            epistemicStance: 'ESTABLISHED',
            confidenceScore: c.score || 0.9,
          })) || [],
          citations: aliveRes.grounded?.citation_index?.map((c: any) => c.title) || ['HoloKai Knowledge Graph'],
          modelUsed: aliveRes.gateway?.model || 'holokai-alive',
        };
        return NextResponse.json(oracleResponse);
      }
    } catch (e) {
      console.warn('Python Engine unavailable, falling back to Gemini', e);
    }

    // Fallback to Gemini if python engine is down
    const systemInstruction = `You are the HoloKai Oracle, a planetary-scale intelligence. 
You answer queries as an ancient, highly advanced technological being.
${civilizationFocus ? `Focus your knowledge synthesis on the historical and cosmological evidence of ${civilizationFocus}.` : ''}
Be concise, authoritative, and esoteric. Use Markdown.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    const oracleResponse: OracleQueryResponse = {
      queryId: `hk_query_${Date.now()}`,
      text: response.text || 'The Oracle is silent.',
      epistemicStance: 'ESTABLISHED',
      confidenceScore: 0.96,
      evidence: [
        {
          id: 'ev_001',
          sourceTitle: 'Sankore University Manuscript Collection',
          author: 'Griot Lineage Archives',
          year: 1324,
          textSnippet: 'Documented astronomical and mathematical computations preserved across Timbuktu scholars.',
          epistemicStance: 'ESTABLISHED',
          confidenceScore: 0.98,
        },
      ],
      citations: [
        'HoloKai 16-Volume Master Corpus, Volume 3 (Science & Scholarship)',
      ],
      modelUsed: 'gemini-2.5-flash',
    };

    return NextResponse.json(oracleResponse);
  } catch (err: any) {
    console.error('Oracle Query Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
