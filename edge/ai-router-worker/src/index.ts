import { GoogleGenAI } from '@google/genai';

export interface Env {
  GEMINI_API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/edge/predict-route') {
      const currentRoute = url.searchParams.get('current') || '/';
      
      let predictedRoute = '/oracle';
      let prefetchRemotes = ['webOracle'];
      let confidence = 0.85;

      try {
        if (env.GEMINI_API_KEY) {
          const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
          
          const prompt = `You are the HoloKai Edge Intelligence Router. 
The user is currently on the route "${currentRoute}".
Based on this, what is the most likely Next.js route they will navigate to next? 
Choose from: ['/', '/oracle', '/archive', '/research']. 
Respond with ONLY a JSON object in this exact format:
{"predictedRoute": "/route", "confidence": 0.95, "prefetchRemotes": ["webMfeName"]}`;

          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
              temperature: 0.1,
              responseMimeType: 'application/json'
            }
          });

          if (response.text) {
            const prediction = JSON.parse(response.text);
            predictedRoute = prediction.predictedRoute;
            confidence = prediction.confidence;
            prefetchRemotes = prediction.prefetchRemotes || [];
          }
        }
      } catch (error) {
        console.error('Edge AI Router prediction failed, falling back to heuristics:', error);
        // Fallback heuristics
        if (currentRoute === '/oracle') {
          predictedRoute = '/archive';
          prefetchRemotes = ['webArchive'];
        } else if (currentRoute === '/archive') {
          predictedRoute = '/research';
          prefetchRemotes = ['webResearch'];
        }
      }

      return new Response(
        JSON.stringify({
          currentRoute,
          predictedRoute,
          confidence,
          prefetchRemotes,
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=30',
          },
        }
      );
    }

    return new Response('Not Found', { status: 404 });
  },
};
