/**
 * Sound for the hero runner, synthesised rather than sampled: a few
 * oscillators and filters, no audio files shipped, no licences to track.
 *
 * The bed is pads and nothing else: five voices holding an open major chord
 * that slides into the next every few seconds, with no beat and no melody to
 * follow. Every voice goes through a low-pass, which is what keeps the whole
 * thing from turning metallic.
 *
 * Nothing is created until the player deliberately starts a run, which is also
 * what satisfies the browsers' autoplay rules: the context is born inside a
 * genuine user gesture.
 */

/**
 * Pads only — no melody, nothing to follow. Four voicings that hold and slide
 * into one another, coloured with sixths, ninths and major sevenths: those are
 * the intervals that make a chord read as open and sunlit. There is not a
 * minor third anywhere in here, which is where the last version got its gloom.
 *
 * Voiced high on purpose. The same notes an octave down turn muddy and heavy;
 * up here they stay airy.
 */
const VOICINGS: number[][] = [
  // C6/9 — C3 E4 G4 A4 D5
  [130.81, 329.63, 392.0, 440.0, 587.33],
  // Fmaj7 — F3 F4 A4 C5 E5
  [174.61, 349.23, 440.0, 523.25, 659.25],
  // Gmaj7 — G3 G4 B4 D5 F#5
  [196.0, 392.0, 493.88, 587.33, 739.99],
  // Fadd9 — F3 F4 A4 C5 G5
  [174.61, 349.23, 440.0, 523.25, 783.99],
];

/** Seconds a chord holds before sliding into the next. */
const CHORD_HOLD = 7;
/** Seconds the slide itself takes: long enough that no chord ever "starts". */
const CHORD_GLIDE = 3.5;

export class RunnerAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private musicFilter: BiquadFilterNode | null = null;
  private voices: OscillatorNode[] = [];
  private lfos: OscillatorNode[] = [];
  private timer: ReturnType<typeof setInterval> | null = null;
  private chord = 0;
  private muted = false;
  /** 0 at the start of a run, 1 at top speed: the tune tightens with it. */
  private intensity = 0;

  constructor(muted: boolean) {
    this.muted = muted;
  }

  /** Must be called from a user gesture. Safe to call repeatedly. */
  private ensure(): AudioContext | null {
    if (this.ctx) {
      if (this.ctx.state === "suspended") void this.ctx.resume();
      return this.ctx;
    }
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;

    const ctx = new Ctor();
    const master = ctx.createGain();
    master.gain.value = this.muted ? 0 : 1;
    master.connect(ctx.destination);

    this.ctx = ctx;
    this.master = master;
    return ctx;
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    // Ramp to exactly zero. setTargetAtTime only ever approaches its target,
    // which leaves a hair of signal behind — and "muted" has to mean silent.
    this.master.gain.linearRampToValueAtTime(muted ? 0 : 1, now + 0.05);
  }

  setIntensity(value: number): void {
    this.intensity = Math.max(0, Math.min(1, value));
    if (!this.ctx || !this.musicFilter) return;
    // The tune opens up as the run gets faster: brighter, never louder.
    this.musicFilter.frequency.setTargetAtTime(
      2200 + this.intensity * 1800,
      this.ctx.currentTime,
      2,
    );
  }

  /** A soft, filtered blip. Sine through a low-pass: no edge, no metal. */
  private blip(from: number, to: number, duration: number, peak: number): void {
    const ctx = this.ctx;
    if (!ctx || !this.master || this.muted) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(from, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), now + duration);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1600, now);
    filter.Q.value = 0.6;

    // A gentle attack rather than an instant one: a hard edge is most of what
    // makes a short tone sound cheap.
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(peak, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  jump(second: boolean): void {
    if (!this.ensure() || this.muted) return;
    // A breath upward. The second jump answers it a little higher.
    this.blip(second ? 380 : 260, second ? 620 : 430, 0.16, 0.05);
  }

  /** Ducking: a short swish passing overhead. Band-passed noise sweeping down,
   *  so it reads as something going past rather than as a tone. */
  duck(): void {
    const ctx = this.ensure();
    if (!ctx || !this.master || this.muted) return;
    const now = ctx.currentTime;

    const frames = Math.floor(ctx.sampleRate * 0.16);
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i++) {
      const t = i / frames;
      // Swells then falls away, so the swish has a direction.
      data[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * t) ** 2;
    }

    const source = ctx.createBufferSource();
    const band = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    source.buffer = buffer;
    band.type = "bandpass";
    band.Q.value = 1.4;
    band.frequency.setValueAtTime(1400, now);
    band.frequency.exponentialRampToValueAtTime(380, now + 0.16);
    gain.gain.value = 0.05;

    source.connect(band);
    band.connect(gain);
    gain.connect(this.master);
    source.start(now);
  }

  crash(): void {
    const ctx = this.ensure();
    if (!ctx || !this.master || this.muted) return;

    // A dull thud: low sine falling away, no harmonics to ring.
    this.blip(180, 55, 0.5, 0.09);

    // Muffled noise under it for body. Low-passed hard, because unfiltered
    // white noise is exactly the metallic hiss to avoid.
    const frames = Math.floor(ctx.sampleRate * 0.35);
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / frames) ** 2.5;
    }

    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    source.buffer = buffer;
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(700, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.35);
    gain.gain.value = 0.09;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    source.start();
  }

  startMusic(): void {
    const ctx = this.ensure();
    if (!ctx || !this.master || this.timer !== null) return;

    const gain = ctx.createGain();
    gain.gain.value = 0.0001;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    // Bright by default: pads only sound sunlit if the upper partials survive.
    filter.frequency.value = 2200 + this.intensity * 1800;
    filter.Q.value = 0.4;
    filter.connect(gain);
    gain.connect(this.master);

    const now = ctx.currentTime;
    this.voices = VOICINGS[this.chord].map((freq, index) => {
      const osc = ctx.createOscillator();
      const voiceGain = ctx.createGain();
      // Sine at the bottom for body, triangles above for a little air.
      osc.type = index === 0 ? "sine" : "triangle";
      osc.frequency.value = freq;
      // A few cents apart so the chord shimmers instead of sitting still.
      osc.detune.value = (index - 2) * 5;
      // The top voices sit further back, which is what stops a high pad from
      // turning shrill.
      voiceGain.gain.value = [0.5, 0.34, 0.3, 0.26, 0.17][index] ?? 0.2;

      // Each voice breathes on its own slow cycle, so the chord is never
      // quite the same twice without anything obviously moving.
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.07 + index * 0.023;
      lfoGain.gain.value = voiceGain.gain.value * 0.35;
      lfo.connect(lfoGain);
      lfoGain.connect(voiceGain.gain);
      lfo.start(now);

      osc.connect(voiceGain);
      voiceGain.connect(filter);
      osc.start(now);
      this.lfos.push(lfo);
      return osc;
    });

    // Long fade in: a pad that arrives is a pad you notice.
    gain.gain.setTargetAtTime(0.5, now, 1.6);
    this.musicGain = gain;
    this.musicFilter = filter;

    this.timer = setInterval(() => this.nextChord(), CHORD_HOLD * 1000);
  }

  /** Slides every voice to the next voicing. Nothing restarts, so there is no
   *  attack to hear — the chord simply becomes another one. */
  private nextChord(): void {
    const ctx = this.ctx;
    if (!ctx || this.voices.length === 0) return;
    this.chord = (this.chord + 1) % VOICINGS.length;
    const target = VOICINGS[this.chord];
    this.voices.forEach((osc, index) => {
      osc.frequency.setTargetAtTime(target[index], ctx.currentTime, CHORD_GLIDE / 3);
    });
  }

  stopMusic(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
    const ctx = this.ctx;
    const gain = this.musicGain;
    const voices = this.voices;
    const lfos = this.lfos;
    this.musicGain = null;
    this.musicFilter = null;
    this.voices = [];
    this.lfos = [];
    if (!ctx || !gain) return;

    // Fade out before stopping the oscillators, or the tail is a click.
    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0.0001, now + 0.6);
    voices.forEach((osc) => osc.stop(now + 0.7));
    lfos.forEach((osc) => osc.stop(now + 0.7));
  }

  dispose(): void {
    this.stopMusic();
    void this.ctx?.close();
    this.ctx = null;
    this.master = null;
  }
}
