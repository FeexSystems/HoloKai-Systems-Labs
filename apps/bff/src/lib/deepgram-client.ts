import { DeepgramClient, LiveTranscriptionEvents, createClient } from '@deepgram/sdk';

export interface DeepgramConfig {
  apiKey: string;
  model?: string;
  language?: string;
  smartFormat?: boolean;
}

export interface TranscriptionResult {
  text: string;
  confidence: number;
  language: string;
  duration: number;
}

export class DeepgramClientWrapper {
  private client: DeepgramClient;
  private model: string;
  private language: string;
  private smartFormat: boolean;

  constructor(config: DeepgramConfig) {
    this.client = createClient(config.apiKey);
    this.model = config.model || 'nova-2';
    this.language = config.language || 'en-US';
    this.smartFormat = config.smartFormat !== false;
  }

  async transcribe(
    audioBuffer: Buffer,
    mimeType: string = 'audio/wav'
  ): Promise<TranscriptionResult> {
    try {
      const { result, error } = await this.client.listen.prerecorded.transcribeFile(
        audioBuffer,
        {
          model: this.model,
          language: this.language,
          smart_format: this.smartFormat,
          mimetype: mimeType,
        }
      );

      if (error) {
        throw new Error(error.message || 'Deepgram transcription failed');
      }

      const transcript = result.results?.channels?.[0]?.alternatives?.[0];
      if (!transcript) {
        throw new Error('No transcription result returned');
      }

      return {
        text: transcript.transcript || '',
        confidence: transcript.confidence || 0,
        language: transcript.language || this.language,
        duration: transcript.words?.reduce((acc, word) => acc + (word.end - word.start), 0) || 0,
      };
    } catch (error) {
      console.error('Deepgram transcription error:', error);
      throw new Error(`Deepgram transcription failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async transcribeWithLanguageDetection(
    audioBuffer: Buffer,
    mimeType: string = 'audio/wav'
  ): Promise<TranscriptionResult> {
    try {
      const { result, error } = await this.client.listen.prerecorded.transcribeFile(
        audioBuffer,
        {
          model: this.model,
          detect_language: true,
          smart_format: this.smartFormat,
          mimetype: mimeType,
        }
      );

      if (error) {
        throw new Error(error.message || 'Deepgram transcription failed');
      }

      const transcript = result.results?.channels?.[0]?.alternatives?.[0];
      if (!transcript) {
        throw new Error('No transcription result returned');
      }

      return {
        text: transcript.transcript || '',
        confidence: transcript.confidence || 0,
        language: transcript.language || 'en-US',
        duration: transcript.words?.reduce((acc, word) => acc + (word.end - word.start), 0) || 0,
      };
    } catch (error) {
      console.error('Deepgram transcription with language detection error:', error);
      throw new Error(`Deepgram transcription failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  createLiveConnection() {
    try {
      const connection = this.client.listen.live({
        model: this.model,
        language: this.language,
        smart_format: this.smartFormat,
        interim_results: true,
      });

      return connection;
    } catch (error) {
      console.error('Deepgram live connection error:', error);
      throw new Error(`Failed to create live connection: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

let deepgramClient: DeepgramClientWrapper | null = null;

export function getDeepgramClient(): DeepgramClientWrapper {
  if (!deepgramClient) {
    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) {
      throw new Error('DEEPGRAM_API_KEY environment variable is required');
    }

    deepgramClient = new DeepgramClientWrapper({
      apiKey,
      model: process.env.DEEPGRAM_MODEL || 'nova-2',
      language: process.env.DEEPGRAM_LANGUAGE || 'en-US',
      smartFormat: process.env.DEEPGRAM_SMART_FORMAT !== 'false',
    });
  }

  return deepgramClient;
}

export function resetDeepgramClient(): void {
  deepgramClient = null;
}
