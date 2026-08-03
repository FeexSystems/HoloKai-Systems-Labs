/**
 * Web Audio API Ambient Soundscape Generator for HoloKai Pan-African Eras.
 * Zero external audio assets required; dynamically synthesizes era-specific audio pads,
 * atmospheric drones, shimmers, and acoustic textures.
 */

export const ERA_SOUNDSCAPES = [
  {
    id: 'kemet',
    name: 'Ancient Kemet & Nubia',
    subtitle: 'Nile River Delta Harmonic Pad',
    keywords: ['kemet', 'egypt', 'nile', 'nubia', 'pyramid', 'pharaoh', 'hieroglyph', 'isis', 'osiris', 'ra', 'amun', 'giza', 'luxor', 'thebes', 'karnak', 'imhotep'],
    accent: '#E6B865',
    baseFreq: 108.0,
    harmonics: [108.0, 216.0, 324.0, 432.0],
    modRate: 0.15,
    filterFreq: 450,
  },
  {
    id: 'timbuktu',
    name: 'Sahel & Timbuktu',
    subtitle: 'Sankore Scroll Sands & Kora Pulse',
    keywords: ['timbuktu', 'mali', 'sahel', 'songhai', 'mansa musa', 'sankore', 'gao', 'djenne', 'manuscript', 'scroll', 'sub-saharan', 'trade route'],
    accent: '#F59E0B',
    baseFreq: 146.83, // D3 key
    harmonics: [146.83, 220.0, 293.66, 440.0],
    modRate: 0.2,
    filterFreq: 650,
  },
  {
    id: 'aksum',
    name: 'Aksumite Highlands',
    subtitle: 'Highland Sanctuary & Bronze Resonance',
    keywords: ['aksum', 'axum', 'ethiopia', 'ge\'ez', 'ezana', 'lalibela', 'stelae', 'abyssinia', 'horn of africa', 'solomonic', 'sheba'],
    accent: '#10B981',
    baseFreq: 130.81, // C3 key
    harmonics: [130.81, 196.0, 261.63, 392.0],
    modRate: 0.1,
    filterFreq: 520,
  },
  {
    id: 'zimbabwe',
    name: 'Great Zimbabwe Citadel',
    subtitle: 'Granite Citadel Sub-Drone & Savannah Breeze',
    keywords: ['zimbabwe', 'monomotapa', 'granite', 'mapungubwe', 'shona', 'zambezi', 'limpopo', 'stone citadel', 'dry-stone'],
    accent: '#8B5CF6',
    baseFreq: 98.0, // G2 key
    harmonics: [98.0, 146.83, 196.0, 293.66],
    modRate: 0.08,
    filterFreq: 380,
  },
  {
    id: 'ifa',
    name: 'Forest of Ifá',
    subtitle: 'Sacred Yoruba Canopy & Log Drum Harmonic',
    keywords: ['ifa', 'yoruba', 'orisha', 'benin', 'ife', 'orunmila', 'odu', 'divination', 'ekpe', 'nsibidi', 'forest', 'grove'],
    accent: '#EC4899',
    baseFreq: 123.47, // B2 key
    harmonics: [123.47, 185.0, 246.94, 370.0],
    modRate: 0.25,
    filterFreq: 700,
  },
  {
    id: 'afrofuturist',
    name: 'Afrofuturist Oracle Core',
    subtitle: 'Quantum Memory Sub-Bass & Crystal Sweep',
    keywords: ['holokai', 'oracle', 'quantum', 'cybernetic', 'future', 'triangulation', 'telemetry', 'core', 'vanguard', 'ai'],
    accent: '#3B82F6',
    baseFreq: 55.0, // A1 sub
    harmonics: [55.0, 110.0, 165.0, 220.0, 440.0],
    modRate: 0.3,
    filterFreq: 850,
  },
];

class AmbientSoundscapeEngine {
  constructor() {
    this.audioCtx = null;
    this.masterGain = null;
    this.oscillators = [];
    this.gainNodes = [];
    this.filterNode = null;
    this.lfo = null;
    this.lfoGain = null;
    this.noiseNode = null;
    this.noiseGain = null;

    this.activeEra = 'afrofuturist';
    this.active = false;
    this.volume = 0.35;
  }

  init() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
        this.masterGain.connect(this.audioCtx.destination);
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
  }

  playEra(eraId = 'afrofuturist') {
    this.init();
    if (!this.audioCtx) return;

    const eraConfig = ERA_SOUNDSCAPES.find(e => e.id === eraId) || ERA_SOUNDSCAPES[5];
    this.activeEra = eraConfig.id;

    if (this.active) {
      this.transitionToEra(eraConfig);
      return;
    }

    this.buildSynthGraph(eraConfig);
    this.active = true;
  }

  buildSynthGraph(config) {
    this.stopSynthNodes();

    const now = this.audioCtx.currentTime;

    // Master Lowpass Filter
    this.filterNode = this.audioCtx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(config.filterFreq, now);
    this.filterNode.Q.setValueAtTime(2.5, now);
    this.filterNode.connect(this.masterGain);

    // Filter LFO Modulation for subtle natural breathing
    this.lfo = this.audioCtx.createOscillator();
    this.lfoGain = this.audioCtx.createGain();
    this.lfo.frequency.setValueAtTime(config.modRate, now);
    this.lfoGain.gain.setValueAtTime(120, now);
    this.lfo.connect(this.lfoGain);
    this.lfoGain.connect(this.filterNode.frequency);
    this.lfo.start(now);

    // Multi-harmonic Pad Oscillators
    config.harmonics.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Organic detune for warm analog feel
      const detuneAmount = (idx - 1.5) * 4.5;
      osc.detune.setValueAtTime(detuneAmount, now);

      const targetGain = 0.25 / (idx + 1);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(targetGain, now + 2.5);

      osc.connect(gain);
      gain.connect(this.filterNode);
      osc.start(now);

      this.oscillators.push(osc);
      this.gainNodes.push(gain);
    });

    // Soft Atmospheric Pink Noise Layer (wind / sand / breeze)
    this.createAtmosphericNoise(now);
  }

  createAtmosphericNoise(now) {
    const bufferSize = this.audioCtx.sampleRate * 2;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.015;
      b6 = white * 0.115926;
    }

    this.noiseNode = this.audioCtx.createBufferSource();
    this.noiseNode.buffer = noiseBuffer;
    this.noiseNode.loop = true;

    this.noiseGain = this.audioCtx.createGain();
    this.noiseGain.gain.setValueAtTime(0.0001, now);
    this.noiseGain.gain.exponentialRampToValueAtTime(0.015, now + 3.0);

    const noiseFilter = this.audioCtx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(320, now);
    noiseFilter.Q.setValueAtTime(1.2, now);

    this.noiseNode.connect(noiseFilter);
    noiseFilter.connect(this.noiseGain);
    this.noiseGain.connect(this.masterGain);

    this.noiseNode.start(now);
  }

  transitionToEra(config) {
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;

    // Smooth filter transition
    if (this.filterNode) {
      this.filterNode.frequency.exponentialRampToValueAtTime(Math.max(100, config.filterFreq), now + 2.0);
    }
    if (this.lfo) {
      this.lfo.frequency.linearRampToValueAtTime(config.modRate, now + 1.5);
    }

    // Retune harmonics smoothly
    this.oscillators.forEach((osc, idx) => {
      const targetFreq = config.harmonics[idx] || config.harmonics[0] * (idx + 1);
      osc.frequency.exponentialRampToValueAtTime(targetFreq, now + 2.5);
    });
  }

  stop() {
    if (!this.audioCtx || !this.active) return;
    const now = this.audioCtx.currentTime;

    if (this.masterGain) {
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.8);
    }

    setTimeout(() => {
      this.stopSynthNodes();
      this.active = false;
      if (this.masterGain && this.audioCtx) {
        this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
      }
    }, 850);
  }

  stopSynthNodes() {
    this.oscillators.forEach(osc => {
      try { osc.stop(); osc.disconnect(); } catch {}
    });
    this.oscillators = [];
    this.gainNodes = [];

    if (this.lfo) {
      try { this.lfo.stop(); this.lfo.disconnect(); } catch {}
      this.lfo = null;
    }
    if (this.noiseNode) {
      try { this.noiseNode.stop(); this.noiseNode.disconnect(); } catch {}
      this.noiseNode = null;
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
    }
  }

  inferEraFromText(text = '') {
    if (!text) return this.activeEra;
    const lower = text.toLowerCase();

    for (const era of ERA_SOUNDSCAPES) {
      if (era.keywords.some(kw => lower.includes(kw))) {
        return era.id;
      }
    }

    return this.activeEra;
  }

  isPlaying() {
    return this.active;
  }

  getCurrentEra() {
    return ERA_SOUNDSCAPES.find(e => e.id === this.activeEra) || ERA_SOUNDSCAPES[5];
  }
}

export const ambientEngine = new AmbientSoundscapeEngine();
