import { ElevenLabsClient } from 'elevenlabs';

export interface VoiceConfig {
  apiKey: string;
  voiceId?: string;
  modelId?: string;
  stability?: number;
  similarityBoost?: number;
}

export interface VoicePreset {
  id: string;
  name: string;
  description: string;
  voiceId: string;
  modelId: string;
  stability: number;
  similarityBoost: number;
}

export const ANCIENT_VOICE_PRESETS: VoicePreset[] = [
  {
    id: 'egyptian-scholar',
    name: 'Egyptian Scholar',
    description: 'Wise historian of ancient Kemet with measured, scholarly tone',
    voiceId: '21m00Tcm4TlvDq8ikWAM',
    modelId: 'eleven_multilingual_v2',
    stability: 0.5,
    similarityBoost: 0.75,
  },
  {
    id: 'roman-historian',
    name: 'Roman Historian',
    description: 'Classical Roman orator with formal, authoritative delivery',
    voiceId: 'AZnzlk1XvdvUeBnXmlld',
    modelId: 'eleven_multilingual_v2',
    stability: 0.5,
    similarityBoost: 0.75,
  },
  {
    id: 'greek-philosopher',
    name: 'Greek Philosopher',
    description: 'Contemplative Socratic dialogue style with thoughtful pauses',
    voiceId: 'EXAVITQu4vr4xnSDxMaL',
    modelId: 'eleven_multilingual_v2',
    stability: 0.6,
    similarityBoost: 0.7,
  },
  {
    id: 'african-griot',
    name: 'African Griot',
    description: 'Traditional West African storyteller with rich, resonant voice',
    voiceId: 'ErXwobaYiNEXWVbfvZGa',
    modelId: 'eleven_multilingual_v2',
    stability: 0.4,
    similarityBoost: 0.8,
  },
  {
    id: 'medieval-scribe',
    name: 'Medieval Scribe',
    description: 'Monastic scholar with calm, measured delivery',
    voiceId: 'MF3mKykXy4cWp34Y9uFo',
    modelId: 'eleven_multilingual_v2',
    stability: 0.6,
    similarityBoost: 0.7,
  },
];

export class VoiceClient {
  private client: ElevenLabsClient;
  private defaultVoiceId: string;
  private defaultModelId: string;
  private defaultStability: number;
  private defaultSimilarityBoost: number;

  constructor(config: VoiceConfig) {
    this.client = new ElevenLabsClient({ apiKey: config.apiKey });
    this.defaultVoiceId = config.voiceId || '21m00Tcm4TlvDq8ikWAM';
    this.defaultModelId = config.modelId || 'eleven_multilingual_v2';
    this.defaultStability = config.stability || 0.5;
    this.defaultSimilarityBoost = config.similarityBoost || 0.75;
  }

  async synthesize(
    text: string,
    options?: {
      voiceId?: string;
      modelId?: string;
      stability?: number;
      similarityBoost?: number;
    }
  ): Promise<Buffer> {
    try {
      const voiceId = options?.voiceId || this.defaultVoiceId;
      const modelId = options?.modelId || this.defaultModelId;
      const stability = options?.stability ?? this.defaultStability;
      const similarityBoost = options?.similarityBoost ?? this.defaultSimilarityBoost;

      const audio = await this.client.textToSpeech.convert(voiceId, {
        text,
        model_id: modelId,
        voice_settings: {
          stability,
          similarity_boost: similarityBoost,
        },
      });

      const chunks: Buffer[] = [];
      for await (const chunk of audio) {
        chunks.push(chunk);
      }

      return Buffer.concat(chunks);
    } catch (error) {
      console.error('Voice synthesis error:', error);
      throw new Error(`Voice synthesis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async *streamSynthesize(
    text: string,
    options?: {
      voiceId?: string;
      modelId?: string;
      stability?: number;
      similarityBoost?: number;
    }
  ): AsyncGenerator<Buffer> {
    try {
      const voiceId = options?.voiceId || this.defaultVoiceId;
      const modelId = options?.modelId || this.defaultModelId;
      const stability = options?.stability ?? this.defaultStability;
      const similarityBoost = options?.similarityBoost ?? this.defaultSimilarityBoost;

      const audio = await this.client.textToSpeech.convert(voiceId, {
        text,
        model_id: modelId,
        voice_settings: {
          stability,
          similarity_boost: similarityBoost,
        },
        output_format: 'mp3_44100_128',
      });

      for await (const chunk of audio) {
        yield chunk;
      }
    } catch (error) {
      console.error('Voice streaming error:', error);
      throw new Error(`Voice streaming failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getVoices(): Promise<any[]> {
    try {
      const voices = await this.client.voices.getAll();
      return voices.voices || [];
    } catch (error) {
      console.error('Get voices error:', error);
      throw new Error(`Failed to retrieve voices: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  getVoicePresets(): VoicePreset[] {
    return ANCIENT_VOICE_PRESETS;
  }

  getVoicePreset(id: string): VoicePreset | undefined {
    return ANCIENT_VOICE_PRESETS.find(preset => preset.id === id);
  }
}

let voiceClient: VoiceClient | null = null;

export function getVoiceClient(): VoiceClient {
  if (!voiceClient) {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      throw new Error('ELEVENLABS_API_KEY environment variable is required');
    }

    voiceClient = new VoiceClient({
      apiKey,
      voiceId: process.env.ELEVENLABS_VOICE_ID,
      modelId: process.env.ELEVENLABS_MODEL_ID,
      stability: process.env.ELEVENLABS_STABILITY ? parseFloat(process.env.ELEVENLABS_STABILITY) : undefined,
      similarityBoost: process.env.ELEVENLABS_SIMILARITY_BOOST ? parseFloat(process.env.ELEVENLABS_SIMILARITY_BOOST) : undefined,
    });
  }

  return voiceClient;
}

export function resetVoiceClient(): void {
  voiceClient = null;
}
