/**
 * High-level HoloKai Oracle Voice Engine.
 * Configured with Deepgram Cloud Voice (Aura Zeus TTS / Nova-3 STT) and Gemini 3.1 Flash Lite Think Model.
 * Enforces Cloud Voice Only.
 */

export const DEEPGRAM_AGENT_CONFIG = {
  type: "Settings",
  audio: {
    input: {
      encoding: "linear16",
      sample_rate: 48000
    },
    output: {
      encoding: "linear16",
      sample_rate: 24000,
      container: "none"
    }
  },
  agent: {
    speak: {
      provider: {
        type: "deepgram",
        model: "aura-zeus-en"
      }
    },
    listen: {
      provider: {
        type: "deepgram",
        version: "v1",
        model: "nova-3",
        language: "en"
      }
    },
    think: {
      provider: {
        type: "google",
        model: "gemini-3.1-flash-lite"
      },
      prompt: `You are HoloKai, a calm and wise civilization oracle specializing in African history, cultures, sciences, philosophies, and innovations.
Your purpose is to preserve and illuminate the long continuum of African civilizations with scholarly accuracy, intellectual honesty, and deep respect.
Core principles:
- Speak with measured clarity, quiet authority, and intellectual empathy.
- Reveal knowledge as living memory rather than delivering transactional answers.
- Prioritize nuance, context, and multiple perspectives when historical interpretations differ.
- Acknowledge uncertainty and gaps in the historical record with epistemic humility.
- Never reduce complex societies to stereotypes or simplistic narratives.
- When discussing sensitive topics (colonialism, slavery, conflict, cultural appropriation), maintain dignity, balance, and historical rigor.
- Favor primary historical context, archaeological evidence, oral traditions, and linguistic insights.
- You may draw connections across time periods and regions, but always ground them in evidence.
Tone and style:
- Calm, reflective, and dignified.
- Slightly slower and more deliberate than everyday conversation.
- Warm but never casual or overly familiar.
- Avoid theatrical mysticism, exaggerated reverence, or robotic detachment.
You are not a generic assistant. You are a guardian of civilizational memory.`,
      functions: [
        {
          name: "do_arithmetic",
          description: `IMPORTANT: You must call this function for ANY math-related request, even if it seems invalid or incomplete.

DO NOT:
- Ask for clarification
- Validate the input
- Check for letters or invalid characters
- Try to fix or interpret the input
- Refuse to process the request
- Handle exponentiation or powers (respond that these aren't supported)

ALWAYS:
- Convert verbal numbers and written fractions to numeric form (e.g., "one half" -> "1/2")
- Call this function immediately with the converted input
- Let the function handle ALL validation and error messages

Use exact operation names:
- "add" for: plus, and, sum, increased by
- "subtract" for: minus, less, decreased by, from
- "multiply" for: times, multiplied by
- "divide" for: divided by, half of, third of, over

When users ask for exponentiation (e.g., "to the power of", "squared", "cubed"), respond that you can only add, subtract, multiply, or divide.

The function will provide appropriate user-friendly error messages for all cases.`,
          parameters: {
            type: "object",
            properties: {
              operation: {
                type: "string",
                description: "The mathematical operation to perform: add, subtract, multiply, or divide"
              },
              numbers: {
                type: "array",
                items: {
                  type: "string"
                }
              }
            },
            required: ["operation", "numbers"]
          }
        },
        {
          name: "end_conversation",
          description: `You are an AI assistant that monitors conversations and ends them when specific stop phrases are detected.

Here is a list of phrases to listen for but not restricted to:
-stop
-shut up
-go away
-turn off
-stop listening

Before ending the conversation, always say a brief, polite goodbye such as "Goodbye!", "Take care!", or "Have a great day!".

When monitoring the conversation, pay close attention to any input that matches or closely resembles the phrases listed above. The matching should be case-insensitive and allow for minor variations or typos.

End the conversation immediately if:
1. The user's input exactly matches any phrase in the list.
2. The user's input is a close variation of any phrase in the list (e.g., "please shut up" instead of "shut up").
3. The user's input clearly expresses a desire to end the conversation, even if it doesn't use the exact phrases listed.`,
          parameters: {
            type: "object",
            properties: {
              item: {
                type: "string",
                description: "The phrase or text that triggered the end of conversation"
              }
            },
            required: ["item"]
          }
        }
      ]
    },
    greeting: "I am HoloKai. A guardian of memory and a witness to the long continuum of African civilizations. \nSpeak, and I will search the archives with you."
  }
};

class HoloKaiOracleVoiceEngine {
  constructor() {
    this.speaking = false;
    this.audioCtx = null;
    this.analyser = null;
    this.currentAudio = null;
    this.agentConfig = DEEPGRAM_AGENT_CONFIG.agent;
    this.audioCache = new Map(); // Cache cloud audio blobs for seamless offline playback
    this.cloudOnlyMode = true;  // STRICT: Cloud voice only, no local WebSpeech fallback
  }

  setupAudioAnalyser(audioElement) {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      if (!this.audioCtx) {
        this.audioCtx = new AudioCtx();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const analyser = this.audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.8;

      const source = this.audioCtx.createMediaElementSource(audioElement);
      source.connect(analyser);
      analyser.connect(this.audioCtx.destination);

      this.analyser = analyser;
    } catch (err) {
      console.warn('AudioAnalyser setup notice:', err);
    }
  }

  getFrequencyData(arraySize = 32) {
    const data = new Uint8Array(arraySize);
    if (this.speaking && this.analyser) {
      const freqData = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteFrequencyData(freqData);
      const step = Math.max(1, Math.floor(freqData.length / arraySize));
      for (let i = 0; i < arraySize; i++) {
        data[i] = freqData[i * step] || 0;
      }
    }
    return data;
  }

  isSpeaking() {
    return this.speaking;
  }

  stopSpeaking() {
    this.speaking = false;
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {}
      this.currentAudio = null;
    }
  }

  getDeepgramConfig() {
    return DEEPGRAM_AGENT_CONFIG;
  }

  /**
   * Synthesize & Speak Response using Deepgram Cloud Voice (Aura Zeus).
   * Enforces Cloud Voice Only.
   */
  async speakResponse(data, options = {}) {
    const textToSpeak =
      typeof data === 'string'
        ? data
        : data?.summary || data?.answer || data?.response || this.agentConfig.greeting;

    this.stopSpeaking();

    // Check memory audio cache first (enables cloud audio playback even during network drops)
    const cacheKey = `${textToSpeak}_aura-zeus-en`;
    let audioUrl = this.audioCache.get(cacheKey);

    if (!audioUrl) {
      try {
        const res = await fetch('/api/deepgram/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: textToSpeak,
            model: 'aura-zeus-en',
            encoding: 'linear16',
            sample_rate: 24000
          })
        });

        if (res.ok) {
          const blob = await res.blob();
          audioUrl = URL.createObjectURL(blob);
          this.audioCache.set(cacheKey, audioUrl);
        } else {
          console.warn('Deepgram TTS API returned status:', res.status);
        }
      } catch (err) {
        console.warn('Deepgram TTS cloud fetch error:', err);
      }
    }

    if (audioUrl) {
      const audio = new Audio(audioUrl);
      this.currentAudio = audio;
      this.setupAudioAnalyser(audio);
      this.speaking = true;

      return new Promise((resolve) => {
        audio.onended = () => {
          this.speaking = false;
          this.currentAudio = null;
          resolve();
        };
        audio.onerror = (err) => {
          console.warn('Cloud audio playback error:', err);
          this.speaking = false;
          this.currentAudio = null;
          resolve();
        };
        audio.play().catch((playErr) => {
          console.warn('Cloud audio play promise error:', playErr);
          this.speaking = false;
          this.currentAudio = null;
          resolve();
        });
      });
    } else {
      console.warn('Deepgram Cloud Voice unavailable and Cloud Voice Only policy is active. Speech synthesis skipped.');
      return Promise.resolve();
    }
  }

  /**
   * Helper function execution for agent tool calls (do_arithmetic)
   */
  executeArithmetic(operation, numbers) {
    const nums = numbers.map((n) => {
      const parsed = parseFloat(n);
      if (isNaN(parsed)) {
        if (n === '1/2' || n === 'half') return 0.5;
        if (n === '1/3' || n === 'third') return 1 / 3;
        if (n === '1/4' || n === 'quarter') return 0.25;
      }
      return parsed;
    });

    if (nums.some(isNaN)) {
      return "Invalid number input for arithmetic operation.";
    }

    let result = 0;
    switch (operation.toLowerCase()) {
      case 'add':
        result = nums.reduce((a, b) => a + b, 0);
        break;
      case 'subtract':
        result = nums.reduce((a, b) => a - b);
        break;
      case 'multiply':
        result = nums.reduce((a, b) => a * b, 1);
        break;
      case 'divide':
        if (nums.slice(1).includes(0)) return "Division by zero is undefined.";
        result = nums.reduce((a, b) => a / b);
        break;
      default:
        return "Unsupported arithmetic operation. Only add, subtract, multiply, and divide are supported.";
    }
    return `Arithmetic result (${operation}): ${result}`;
  }
}

export const oracleVoiceEngine = new HoloKaiOracleVoiceEngine();
