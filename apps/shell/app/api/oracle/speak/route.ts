import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, engine, voiceId } = await req.json();
    
    if (!text) {
      return NextResponse.json({ error: 'Text is required for synthesis' }, { status: 400 });
    }

    if (engine === 'elevenlabs') {
      const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || process.env.VITE_ELEVENLABS_API_KEY;
      if (!ELEVENLABS_API_KEY) throw new Error('ElevenLabs API Key not configured');

      const vId = voiceId || '21m00Tcm4TlvDq8ikWAM'; // Default voice
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${vId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs error: ${response.statusText}`);
      }

      const audioBuffer = await response.arrayBuffer();
      return new NextResponse(audioBuffer, {
        headers: {
          'Content-Type': 'audio/mpeg'
        }
      });
    } else if (engine === 'deepgram') {
      const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY || process.env.VITE_DEEPGRAM_API_KEY;
      if (!DEEPGRAM_API_KEY) throw new Error('Deepgram API Key not configured');

      const response = await fetch('https://api.deepgram.com/v1/speak?model=aura-asteria-en', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${DEEPGRAM_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error(`Deepgram error: ${response.statusText}`);
      }

      const audioBuffer = await response.arrayBuffer();
      return new NextResponse(audioBuffer, {
        headers: {
          'Content-Type': 'audio/mpeg'
        }
      });
    } else {
      return NextResponse.json({ error: 'Unsupported TTS engine' }, { status: 400 });
    }
  } catch (err: any) {
    console.error('Oracle TTS Error:', err);
    return NextResponse.json({ error: err.message || 'TTS Error' }, { status: 500 });
  }
}
