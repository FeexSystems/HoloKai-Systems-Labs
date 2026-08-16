/**
 * Web Audio API synthesizer for retro-futuristic sound effects.
 * Requires no external audio files.
 */
class RetroAudioSynthesizer {
  private audioCtx: AudioContext | null = null;
  private audioGuideEnabled: boolean = true;
  private soundEffectsEnabled: boolean = true;

  init() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
  }

  // Generic click sound effect wrapper
  playClick() {
    this.playTerminalKeyClick();
  }

  // Play mechanical terminal key click sound
  playTerminalKeyClick() {
    if (!this.soundEffectsEnabled) return;
    try {
      this.init();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // Slightly randomized frequency for organic mechanical feel
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800 + Math.random() * 400, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.025);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.025);
    } catch {
      // Ignore audio context autoplay restrictions
    }
  }

  // Play subtle hover hum sound effect
  playGlassHoverHum() {
    if (!this.soundEffectsEnabled) return;
    try {
      this.init();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.06);

      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Ignore audio context autoplay restrictions
    }
  }

  // Play short futuristic chime when activating an oracle feature
  playOracleChime() {
    if (!this.soundEffectsEnabled) return;
    try {
      this.init();
      const ctx = this.audioCtx;
      if (!ctx) return;

      const now = ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.04, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.15);
      });
    } catch {
      // Ignore audio context autoplay restrictions
    }
  }

  // Play short success chime
  playSuccessChime() {
    this.playOracleChime();
  }

  setAudioGuideEnabled(enabled: boolean) {
    this.audioGuideEnabled = enabled;
  }

  setSoundEffectsEnabled(enabled: boolean) {
    this.soundEffectsEnabled = enabled;
  }
}

export const retroAudio = new RetroAudioSynthesizer();
