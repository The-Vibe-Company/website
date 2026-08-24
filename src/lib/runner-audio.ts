/**
 * Sound for the hero runner, synthesised rather than sampled: a few
 * oscillators and filters, no audio files shipped, no licences to track.
 *
 * The loop is an actual tune — eight bars in C major over I–V–vi–IV — carried
 * by four voices: a melody, a bass, a quiet chord bed and a soft tick for
 * motion. Every voice goes through a low-pass, which is what keeps the whole
 * thing from turning metallic.
 *
 * Nothing is created until the player deliberately starts a run, which is also
 * what satisfies the browsers' autoplay rules: the context is born inside a
 * genuine user gesture.
 */

/**
 * Eight bars in C major, I–V–vi–IV twice over with a turnaround: the most
 * consonant progression there is, which is the point — the run should feel
 * light, not haunted.
 */
const CHORDS: [number, number, number][] = [
  [261.63, 329.63, 392.0], // C
  [246.94, 293.66, 392.0], // G
  [261.63, 329.63, 440.0], // Am
  [261.63, 349.23, 440.0], // F
  [261.63, 329.63, 392.0], // C
  [246.94, 293.66, 392.0], // G
  [261.63, 349.23, 440.0], // F
  [246.94, 293.66, 392.0], // G
];

/** Root of each bar, two octaves down. */
const BASS = [65.41, 98.0, 110.0, 87.31, 65.41, 98.0, 87.31, 98.0];

/**
 * The tune: eight bars of eighth notes, 0 for a rest. Every note that lands on
 * a strong beat belongs to the chord under it, which is what stops a loop this
 * short from grating after the third time round.
 */
const N = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99,
} as const;

const MELODY: number[] = [
  N.E4, N.G4, N.C5, 0, N.G4, 0, N.E4, 0,
  N.D5, 0, N.B4, 0, N.G4, N.A4, N.B4, 0,
  N.C5, 0, N.A4, 0, N.E5, 0, N.C5, N.D5,
  N.A4, 0, N.C5, 0, N.F4, N.G4, N.A4, 0,
  N.G4, 0, N.E4, 0, N.C5, 0, N.D5, N.E5,
  N.D5, 0, N.B4, 0, N.D5, 0, N.G5, 0,
  N.C5, 0, N.A4, 0, N.F4, 0, N.A4, N.C5,
  N.B4, 0, N.D5, 0, N.G4, 0, N.B4, N.D5,
];

const STEPS_PER_BAR = 8;

export class RunnerAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private musicFilter: BiquadFilterNode | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private nextStepTime = 0;
  private step = 0;
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
      1500 + this.intensity * 1600,
      this.ctx.currentTime,
      1.5,
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
    filter.frequency.value = 1500 + this.intensity * 1600;
    filter.Q.value = 0.5;
    filter.connect(gain);
    gain.connect(this.master);

    gain.gain.setTargetAtTime(0.62, ctx.currentTime, 0.4);
    this.musicGain = gain;
    this.musicFilter = filter;
    this.step = 0;
    this.nextStepTime = ctx.currentTime + 0.08;

    // Standard lookahead scheduler: a timer this coarse could never keep time
    // on its own, so it only queues notes that the audio clock plays exactly.
    this.timer = setInterval(() => this.schedule(), 25);
  }

  stopMusic(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
    const ctx = this.ctx;
    const gain = this.musicGain;
    this.musicGain = null;
    this.musicFilter = null;
    if (!ctx || !gain) return;

    // Fade before the last notes ring out, or the tail is a click.
    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0.0001, now + 0.35);
  }

  private schedule(): void {
    const ctx = this.ctx;
    if (!ctx || !this.musicFilter) return;

    // Eighth notes. The tempo lifts with the run, but only a little: the tune
    // should follow the game, not race it.
    const stepDuration = 60 / (108 + this.intensity * 26) / 2;
    while (this.nextStepTime < ctx.currentTime + 0.12) {
      this.playStep(this.step, this.nextStepTime, stepDuration);
      this.step = (this.step + 1) % MELODY.length;
      this.nextStepTime += stepDuration;
    }
  }

  /** One voice of the tune, always through the shared low-pass. */
  private voice(
    freq: number,
    when: number,
    duration: number,
    type: OscillatorType,
    peak: number,
    attack = 0.012,
  ): void {
    const ctx = this.ctx;
    const dest = this.musicFilter;
    if (!ctx || !dest) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, when);
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(peak, when + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(when);
    osc.stop(when + duration + 0.03);
  }

  private playStep(step: number, when: number, stepDuration: number): void {
    const ctx = this.ctx;
    const dest = this.musicFilter;
    if (!ctx || !dest) return;

    const inBar = step % STEPS_PER_BAR;
    const bar = Math.floor(step / STEPS_PER_BAR);

    // Melody: triangle, soft attack, a touch of ring so the phrase joins up.
    const note = MELODY[step];
    if (note) this.voice(note, when, stepDuration * 1.7, "triangle", 0.075, 0.02);

    // Bass on the downbeat and, lighter, on the half bar.
    if (inBar === 0) this.voice(BASS[bar], when, stepDuration * 2.4, "sine", 0.12, 0.02);
    else if (inBar === 4) this.voice(BASS[bar], when, stepDuration * 1.4, "sine", 0.07, 0.02);

    // Chord bed: the triad held quietly under the bar.
    if (inBar === 0) {
      for (const freq of CHORDS[bar]) {
        this.voice(freq / 2, when, stepDuration * 7, "triangle", 0.014, 0.25);
      }
    }

    // A soft tick on the off-beats for motion. Filtered noise, not a drum.
    if (inBar % 2 === 1) {
      const frames = Math.floor(ctx.sampleRate * 0.04);
      const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / frames) ** 3;
      const source = ctx.createBufferSource();
      const band = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      source.buffer = buffer;
      band.type = "bandpass";
      band.frequency.value = 2100;
      band.Q.value = 1.2;
      gain.gain.value = 0.026;
      source.connect(band);
      band.connect(gain);
      gain.connect(dest);
      source.start(when);
    }
  }

  dispose(): void {
    this.stopMusic();
    void this.ctx?.close();
    this.ctx = null;
    this.master = null;
  }
}
