import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { text, accent, name } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Map unit names to specific ElevenLabs voice IDs
    const voiceIdMap: Record<string, string> = {
      'oluwa-core': 'pNInz6obpgDQGcFmaJcg', // Adam (Griot)
      'naja-7': 'VR6AewLTigWG4xSOukaG', // Antoni (Sentinel)
      'kemet-alpha': 'EXAVITQu4vr4xnSDxMaL', // Bella (Archivist)
      'zamani': 'pNInz6obpgDQGcFmaJcg', // Adam (Scholar)
      'bantu-node': 'VR6AewLTigWG4xSOukaG', // Antoni (Navigator)
      'sika-gold': 'EXAVITQu4vr4xnSDxMaL', // Bella (Artisan)
      'asante-v': '21m00Tcm4TlvDq8ikWAM', // Rachel (Oracle)
      'kush-prime': '21m00Tcm4TlvDq8ikWAM', // Rachel (Weaver)
      neutral: '21m00Tcm4TlvDq8ikWAM',
    };

    const key = (name || accent || 'neutral').toLowerCase();
    const voiceId = voiceIdMap[key] || voiceIdMap.neutral;
    const apiKey = process.env.ELEVENLABS_API_KEY || 'sk_a982b655'; // Using the provided key/prefix if env missing

    if (!apiKey) {
      console.warn("No ElevenLabs API key found, returning mock audio.");
      return NextResponse.json({ error: 'Missing ElevenLabs API key' }, { status: 500 });
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('ElevenLabs API Error:', errorData);
      return NextResponse.json({ error: 'Failed to synthesize voice' }, { status: response.status });
    }

    const arrayBuffer = await response.arrayBuffer();
    
    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': arrayBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error('Voice API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
