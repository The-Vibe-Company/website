/**
 * Sound for the hero runner, synthesised rather than sampled: a few
 * oscillators and filters, no audio files shipped, no licences to track.
 *
 * The bed is a looping ambient track, streamed through the same master gain as
 * the effects so one mute silences everything. The effects stay synthesised:
 * a few oscillators and filters, all low-passed, which is what keeps them from
 * turning metallic.
 *
 * Nothing is created until the player deliberately starts a run, which is also
 * what satisfies the browsers' autoplay rules: the context is born inside a
 * genuine user gesture.
 */

/** The bed, streamed rather than synthesised. Fetched on the first run only. */
const TRACK_URL = "/audio/runner/ambient.m4a";
/** Sits under the effects: the bed should never be the loudest thing. */
const TRACK_LEVEL = 0.5;

export class RunnerAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private track: HTMLAudioElement | null = null;
  private trackGain: GainNode | null = null;
  private pauseTimer: ReturnType<typeof setTimeout> | null = null;
  private muted = false;
  /** 0 at the start of a run, 1 at top speed: the bed leans in with it. */
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
    if (!this.ctx || !this.trackGain) return;
    // The bed leans in a little as the run speeds up. Only a little: it is a
    // recording, not a synth, and pushing it around reads as a mistake.
    this.trackGain.gain.setTargetAtTime(
      TRACK_LEVEL * (1 + this.intensity * 0.25),
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

  /**
   * The track is only fetched when someone actually plays: `preload = "none"`
   * means a visitor who never presses space never downloads it.
   */
  private ensureTrack(ctx: AudioContext): HTMLAudioElement | null {
    if (this.track) return this.track;
    if (!this.master) return null;

    // Order matters: `new Audio(url)` starts fetching immediately in some
    // browsers, so preload is set before the source is ever assigned.
    const el = new Audio();
    el.preload = "none";
    el.loop = true;
    el.crossOrigin = "anonymous";
    el.src = TRACK_URL;
    // Routed through the graph rather than played on its own, so the mute
    // toggle and the master fade cover it like everything else.
    const source = ctx.createMediaElementSource(el);
    const gain = ctx.createGain();
    gain.gain.value = 0.0001;
    source.connect(gain);
    gain.connect(this.master);

    this.track = el;
    this.trackGain = gain;
    return el;
  }

  startMusic(): void {
    const ctx = this.ensure();
    if (!ctx || !this.master) return;
    const el = this.ensureTrack(ctx);
    if (!el || !this.trackGain) return;

    const now = ctx.currentTime;
    this.trackGain.gain.cancelScheduledValues(now);
    this.trackGain.gain.setValueAtTime(Math.max(0.0001, this.trackGain.gain.value), now);
    this.trackGain.gain.linearRampToValueAtTime(TRACK_LEVEL, now + 1.2);

    // A rejected play() is normal — an autoplay policy, or a pause landing
    // mid-promise — and nothing here should throw because of it.
    void el.play().catch(() => {});
  }

  stopMusic(): void {
    const ctx = this.ctx;
    const el = this.track;
    const gain = this.trackGain;
    if (!ctx || !el || !gain) return;

    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(Math.max(0.0001, gain.gain.value), now);
    gain.gain.linearRampToValueAtTime(0.0001, now + 0.45);

    // Pause after the fade, not through it. Guarded so a restart during the
    // fade does not have the track pulled out from under it.
    if (this.pauseTimer !== null) clearTimeout(this.pauseTimer);
    this.pauseTimer = setTimeout(() => {
      this.pauseTimer = null;
      if (gain.gain.value < 0.01) el.pause();
    }, 500);
  }

  dispose(): void {
    this.stopMusic();
    if (this.pauseTimer !== null) clearTimeout(this.pauseTimer);
    this.pauseTimer = null;
    this.track?.pause();
    this.track = null;
    this.trackGain = null;
    void this.ctx?.close();
    this.ctx = null;
    this.master = null;
  }
}
