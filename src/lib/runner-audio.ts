/**
 * Sound for the hero runner, synthesised rather than sampled: a few
 * oscillators and filters, no audio files shipped, no licences to track.
 *
 * The brief is ambient, not chiptune. There is no beat and no melody — just a
 * slow chord that breathes underneath, and two soft, filtered effects. Every
 * voice goes through a low-pass, which is what keeps the whole thing from
 * turning metallic.
 *
 * Nothing is created until the player deliberately starts a run, which is also
 * what satisfies the browsers' autoplay rules: the context is born inside a
 * genuine user gesture.
 */

/** Chords the pad drifts between, low and open. A minor, F, C, G. */
const CHORDS = [
  [110, 164.81, 261.63],
  [87.31, 130.81, 220],
  [130.81, 196, 329.63],
  [98, 146.83, 293.66],
];
const CHORD_SECONDS = 9;

export class RunnerAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private padGain: GainNode | null = null;
  private padFilter: BiquadFilterNode | null = null;
  private pad: OscillatorNode[] = [];
  private timer: ReturnType<typeof setInterval> | null = null;
  private chord = 0;
  private muted = false;
  /** 0 at the start of a run, 1 at top speed: the pad opens up with it. */
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
    if (!this.ctx || !this.padFilter) return;
    // The pad opens as the run gets faster: brighter, never louder.
    this.padFilter.frequency.setTargetAtTime(
      420 + this.intensity * 700,
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

    const padGain = ctx.createGain();
    padGain.gain.value = 0.0001;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 420 + this.intensity * 700;
    filter.Q.value = 0.8;

    filter.connect(padGain);
    padGain.connect(this.master);

    // Three voices, slightly detuned against each other so the chord moves on
    // its own without anything having to modulate it.
    this.pad = CHORDS[this.chord].map((freq, index) => {
      const osc = ctx.createOscillator();
      osc.type = index === 0 ? "sine" : "triangle";
      osc.frequency.value = freq;
      osc.detune.value = (index - 1) * 6;
      osc.connect(filter);
      osc.start();
      return osc;
    });

    padGain.gain.setTargetAtTime(0.055, ctx.currentTime, 2);
    this.padGain = padGain;
    this.padFilter = filter;

    // Chords glide into each other rather than cut: nine seconds apart, three
    // to cross over.
    this.timer = setInterval(() => this.nextChord(), CHORD_SECONDS * 1000);
  }

  private nextChord(): void {
    const ctx = this.ctx;
    if (!ctx || this.pad.length === 0) return;
    this.chord = (this.chord + 1) % CHORDS.length;
    const target = CHORDS[this.chord];
    this.pad.forEach((osc, index) => {
      osc.frequency.setTargetAtTime(target[index], ctx.currentTime, 3);
    });
  }

  stopMusic(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
    const ctx = this.ctx;
    if (!ctx || !this.padGain) return;

    const now = ctx.currentTime;
    const voices = this.pad;
    const gain = this.padGain;
    this.pad = [];
    this.padGain = null;
    this.padFilter = null;

    // Fade out before stopping, or the tail is a click.
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0.0001, now + 0.5);
    voices.forEach((osc) => osc.stop(now + 0.6));
  }

  dispose(): void {
    this.stopMusic();
    void this.ctx?.close();
    this.ctx = null;
    this.master = null;
  }
}
