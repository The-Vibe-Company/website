/**
 * Sound for the hero runner, synthesised rather than sampled.
 *
 * Everything here is a handful of oscillators and envelopes: no audio files to
 * ship, no licences to track, and a total cost of a few hundred bytes. The
 * palette matches the panel — dry, short, a little brutal.
 *
 * Nothing is created until the player deliberately starts a run, which is also
 * what satisfies the browsers' autoplay rules: the context is born inside a
 * genuine user gesture.
 */

/** A minor pentatonic, low enough to sit under the sound effects. */
const BASS = [110, 110, 146.83, 130.81];
const MOTIF = [329.63, 392, 440, 392, 329.63, 293.66, 329.63, 392];
const STEPS_PER_BAR = 8;

export class RunnerAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private music: GainNode | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private nextStepTime = 0;
  private step = 0;
  private muted = false;
  /** 0 at the start of a run, 1 at top speed: the loop tightens with it. */
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

    const music = ctx.createGain();
    music.gain.value = 0;
    music.connect(master);

    this.ctx = ctx;
    this.master = master;
    this.music = music;
    return ctx;
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (!this.ctx || !this.master) return;
    // A ramp rather than a jump: flipping a gain to zero on a running
    // oscillator is an audible click.
    this.master.gain.cancelScheduledValues(this.ctx.currentTime);
    this.master.gain.setTargetAtTime(muted ? 0 : 1, this.ctx.currentTime, 0.02);
  }

  setIntensity(value: number): void {
    this.intensity = Math.max(0, Math.min(1, value));
  }

  /** One shaped tone. Every effect in the game is built from this. */
  private tone(
    from: number,
    to: number,
    duration: number,
    type: OscillatorType,
    peak: number,
  ): void {
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, now);
    if (to !== from) osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), now + duration);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(peak, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.master);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  jump(second: boolean): void {
    if (!this.ensure()) return;
    // The second jump answers the first, higher.
    this.tone(second ? 520 : 340, second ? 900 : 660, 0.11, "square", 0.075);
  }

  crash(): void {
    const ctx = this.ensure();
    if (!ctx || !this.master) return;
    this.tone(220, 45, 0.36, "sawtooth", 0.16);

    // A short burst of noise under it, so the hit has some grit.
    const frames = Math.floor(ctx.sampleRate * 0.22);
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / frames) ** 2;
    }
    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    gain.gain.value = 0.14;
    source.buffer = buffer;
    source.connect(gain);
    gain.connect(this.master);
    source.start();
  }

  startMusic(): void {
    const ctx = this.ensure();
    if (!ctx || !this.music || this.timer !== null) return;

    this.music.gain.cancelScheduledValues(ctx.currentTime);
    this.music.gain.setTargetAtTime(0.5, ctx.currentTime, 0.15);
    this.step = 0;
    this.nextStepTime = ctx.currentTime + 0.05;

    // Standard lookahead scheduler: a timer this coarse could never keep time
    // on its own, so it only queues notes that the audio clock plays exactly.
    this.timer = setInterval(() => this.schedule(), 25);
  }

  stopMusic(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (!this.ctx || !this.music) return;
    this.music.gain.cancelScheduledValues(this.ctx.currentTime);
    this.music.gain.setTargetAtTime(0, this.ctx.currentTime, 0.08);
  }

  private schedule(): void {
    const ctx = this.ctx;
    if (!ctx || !this.music) return;

    const stepDuration = 60 / (112 + this.intensity * 30) / 2; // eighth notes
    while (this.nextStepTime < ctx.currentTime + 0.12) {
      this.playStep(this.step, this.nextStepTime, stepDuration);
      this.step = (this.step + 1) % (STEPS_PER_BAR * 4);
      this.nextStepTime += stepDuration;
    }
  }

  private playStep(step: number, when: number, stepDuration: number): void {
    const ctx = this.ctx;
    const music = this.music;
    if (!ctx || !music) return;
    const inBar = step % STEPS_PER_BAR;
    const bar = Math.floor(step / STEPS_PER_BAR);

    const voice = (freq: number, duration: number, type: OscillatorType, peak: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, when);
      gain.gain.setValueAtTime(0.0001, when);
      gain.gain.exponentialRampToValueAtTime(peak, when + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
      osc.connect(gain);
      gain.connect(music);
      osc.start(when);
      osc.stop(when + duration + 0.02);
    };

    // Bass on the downbeat and the half bar.
    if (inBar === 0 || inBar === 4) {
      voice(BASS[bar % BASS.length], stepDuration * 1.6, "triangle", 0.16);
    }
    // A quiet motif note on the off-beats, thinning out early in a run.
    if (inBar % 2 === 1 && (this.intensity > 0.25 || inBar === 3)) {
      voice(MOTIF[(bar * 2 + (inBar >> 1)) % MOTIF.length], stepDuration * 0.7, "square", 0.03);
    }
  }

  dispose(): void {
    this.stopMusic();
    void this.ctx?.close();
    this.ctx = null;
    this.master = null;
    this.music = null;
  }
}
