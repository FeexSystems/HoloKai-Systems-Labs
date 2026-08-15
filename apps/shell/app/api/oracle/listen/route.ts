import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as Blob;
    
    if (!audioFile) {
      return NextResponse.json({ error: 'Audio file is required' }, { status: 400 });
    }

    const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY || process.env.VITE_DEEPGRAM_API_KEY;
    if (!DEEPGRAM_API_KEY) {
      throw new Error('Deepgram API Key not configured');
    }

    // Convert the Blob into an ArrayBuffer and then a Buffer
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Call Deepgram's pre-recorded API
    const response = await fetch('https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${DEEPGRAM_API_KEY}`,
        'Content-Type': audioFile.type || 'audio/webm',
      },
      body: buffer,
    });

    if (!response.ok) {
      throw new Error(`Deepgram STT error: ${response.statusText}`);
    }

    const result = await response.json();
    // Safely extract transcript
    const transcript = result?.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';

    return NextResponse.json({ transcript });
  } catch (err: any) {
    console.error('Oracle Listen Error:', err);
    return NextResponse.json({ error: err.message || 'STT Error' }, { status: 500 });
  }
}
