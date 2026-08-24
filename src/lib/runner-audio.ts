/**
 * Sound for the hero runner, synthesised rather than sampled: a few
 * oscillators and filters, no audio files shipped, no licences to track.
 *
 * The bed is pads and nothing else: five voices holding a chord that cuts to
 * the next every couple of seconds, with no beat and no melody to follow.
 * Every voice goes through a low-pass, which is what keeps the whole thing
 * from turning metallic.
 *
 * Nothing is created until the player deliberately starts a run, which is also
 * what satisfies the browsers' autoplay rules: the context is born inside a
 * genuine user gesture.
 */

// --- the score ---------------------------------------------------------------
// Am → Dm → Gm → F, on a loop, cutting rather than gliding: every voice jumps
// straight to its new note, which is what gives the progression its edge. Only
// the pitch jumps, never the level, so an abrupt change never clicks.
//
// Three sections take turns so a long run does not wear the loop out. They all
// keep the same roots and the same cut, which is what lets them follow each
// other without a seam: A states it plainly, B colours the same chords with
// sevenths, C keeps the harmony and chops it into a rhythm.

/** One step is an eighth note; eight of them make a bar, one bar per chord. */
const STEP_SECONDS = 0.3;
const BAR_STEPS = 8;
const BARS_PER_SECTION = 8;

const N = {
  F4: 349.23, G4: 392.0, A4: 440.0, Bb4: 466.16,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46,
} as const;

/** Five voices per chord: root, then the chord climbing. The upper voices hold
 *  notes in common between chords, which keeps the loop together while the
 *  roots stride underneath. */
const TRIADS: number[][] = [
  [110.0, 220.0, 261.63, 329.63, 440.0], // Am  — A2 A3 C4 E4 A4
  [146.83, 220.0, 293.66, 349.23, 440.0], // Dm  — D3 A3 D4 F4 A4
  [98.0, 196.0, 233.08, 293.66, 392.0], // Gm  — G2 G3 Bb3 D4 G4
  [87.31, 220.0, 261.63, 349.23, 440.0], // F   — F2 A3 C4 F4 A4
];

/** Same roots, coloured: the seventh replaces a doubled octave. */
const SEVENTHS: number[][] = [
  [110.0, 220.0, 261.63, 329.63, 392.0], // Am7   — A2 A3 C4 E4 G4
  [146.83, 220.0, 293.66, 349.23, 523.25], // Dm7   — D3 A3 D4 F4 C5
  [98.0, 196.0, 233.08, 293.66, 349.23], // Gm7   — G2 G3 Bb3 D4 F4
  [87.31, 220.0, 261.63, 349.23, 329.63], // Fmaj7 — F2 A3 C4 F4 E4
];

interface Section {
  chords: number[][];
  /** One row per chord, one slot per step of the bar. 0 is a rest. */
  melody: number[][];
  /** Second time round the four chords, if the section varies. */
  melodyAlt?: number[][];
  /** How long a melody note rings, in steps. */
  noteLength: number;
  /** Per-step gate for the pad. Absent means it simply holds. */
  padGate?: boolean[];
}

const SECTIONS: Section[] = [
  // A — states the thing. One note per chord, left to ring.
  {
    chords: TRIADS,
    noteLength: 4,
    melody: [
      [N.A4, 0, 0, 0, 0, 0, 0, 0],
      [N.D5, 0, 0, 0, 0, 0, 0, 0],
      [N.G4, 0, 0, 0, 0, 0, 0, 0],
      [N.C5, 0, 0, 0, 0, 0, 0, 0],
    ],
    // Second pass answers each note late in the bar.
    melodyAlt: [
      [N.A4, 0, 0, 0, 0, 0, N.C5, 0],
      [N.D5, 0, 0, 0, 0, 0, N.A4, 0],
      [N.G4, 0, 0, 0, 0, 0, N.Bb4, 0],
      [N.C5, 0, 0, 0, 0, 0, N.A4, 0],
    ],
  },
  // B — the same chords with their sevenths, the line opening out.
  {
    chords: SEVENTHS,
    noteLength: 2.5,
    melody: [
      [N.A4, 0, 0, N.C5, 0, 0, N.E5, 0],
      [N.D5, 0, 0, N.A4, 0, 0, N.C5, 0],
      [N.G4, 0, 0, N.Bb4, 0, 0, N.D5, 0],
      [N.C5, 0, 0, N.A4, 0, 0, N.E5, 0],
    ],
  },
  // C — same harmony, chopped. The pad stops holding and starts pulsing.
  {
    chords: TRIADS,
    noteLength: 0.7,
    padGate: [true, false, true, false, true, false, true, true],
    melody: [
      [N.A4, 0, N.C5, 0, N.A4, 0, N.E5, 0],
      [N.D5, 0, N.A4, 0, N.D5, 0, N.F5, 0],
      [N.D5, 0, N.Bb4, 0, N.G4, 0, N.D5, 0],
      [N.C5, 0, N.A4, 0, N.C5, 0, N.F5, 0],
    ],
  },
];

export class RunnerAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private musicFilter: BiquadFilterNode | null = null;
  private padBus: GainNode | null = null;
  private voices: OscillatorNode[] = [];
  private lfos: OscillatorNode[] = [];
  private timer: ReturnType<typeof setInterval> | null = null;
  private nextStepTime = 0;
  private step = 0;
  private section = 0;
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
      1800 + this.intensity * 1600,
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
    filter.frequency.value = 1800 + this.intensity * 1600;
    filter.Q.value = 0.4;
    filter.connect(gain);
    gain.connect(this.master);

    // The pad has its own bus so section C can chop it without touching the
    // melody riding over the top.
    const padBus = ctx.createGain();
    padBus.gain.value = 1;
    padBus.connect(filter);

    const now = ctx.currentTime;
    const section = SECTIONS[this.section];
    this.voices = section.chords[0].map((freq, index) => {
      const osc = ctx.createOscillator();
      const voiceGain = ctx.createGain();
      // Sine at the bottom for body, triangles above for a little air.
      osc.type = index === 0 ? "sine" : "triangle";
      osc.frequency.value = freq;
      // A few cents apart so the chord shimmers instead of sitting still.
      osc.detune.value = (index - 2) * 5;
      // The top voices sit further back, which stops a high pad turning shrill.
      voiceGain.gain.value = [0.5, 0.34, 0.3, 0.26, 0.17][index] ?? 0.2;

      // Each voice breathes on its own slow cycle, so the chord is never quite
      // the same twice without anything obviously moving.
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.07 + index * 0.023;
      lfoGain.gain.value = voiceGain.gain.value * 0.35;
      lfo.connect(lfoGain);
      lfoGain.connect(voiceGain.gain);
      lfo.start(now);

      osc.connect(voiceGain);
      voiceGain.connect(padBus);
      osc.start(now);
      this.lfos.push(lfo);
      return osc;
    });

    // Long fade in: a pad that arrives is a pad you notice. Five voices with
    // their own tremolo sum to well over unity, so the bed sits low — measured
    // at the output, this lands around 0.15 peak rather than 0.64.
    gain.gain.setTargetAtTime(0.12, now, 1.6);
    this.musicGain = gain;
    this.musicFilter = filter;
    this.padBus = padBus;
    this.step = 0;
    this.section = 0;
    this.nextStepTime = now + 0.08;

    // Standard lookahead scheduler: a timer this coarse could never keep time
    // on its own, so it only queues events the audio clock plays exactly.
    this.timer = setInterval(() => this.schedule(), 25);
  }

  private schedule(): void {
    const ctx = this.ctx;
    if (!ctx || !this.musicFilter) return;
    while (this.nextStepTime < ctx.currentTime + 0.12) {
      this.playStep(this.step, this.nextStepTime);
      this.step = (this.step + 1) % (BAR_STEPS * BARS_PER_SECTION);
      if (this.step === 0) this.section = (this.section + 1) % SECTIONS.length;
      this.nextStepTime += STEP_SECONDS;
    }
  }

  private playStep(step: number, when: number): void {
    const ctx = this.ctx;
    const filter = this.musicFilter;
    if (!ctx || !filter) return;

    const section = SECTIONS[this.section];
    const bar = Math.floor(step / BAR_STEPS);
    const inBar = step % BAR_STEPS;
    const chord = bar % section.chords.length;

    // On the downbeat, cut every voice to the new chord. No ramp: the whole
    // point is that the change is heard as a change.
    if (inBar === 0) {
      const target = section.chords[chord];
      this.voices.forEach((osc, index) => {
        osc.frequency.cancelScheduledValues(when);
        osc.frequency.setValueAtTime(target[index], when);
      });
    }

    // Section C pulses the pad instead of letting it hold.
    if (this.padBus) {
      const gate = section.padGate;
      if (gate) {
        const level = gate[inBar] ? 1 : 0.18;
        this.padBus.gain.setTargetAtTime(level, when, 0.03);
      } else if (inBar === 0) {
        this.padBus.gain.setTargetAtTime(1, when, 0.2);
      }
    }

    // The melody: a handful of chord tones with room to breathe.
    const rows = bar >= section.chords.length && section.melodyAlt ? section.melodyAlt : section.melody;
    const note = rows[chord][inBar];
    if (note) {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(note, when);
      const duration = section.noteLength * STEP_SECONDS;
      noteGain.gain.setValueAtTime(0.0001, when);
      noteGain.gain.exponentialRampToValueAtTime(0.09, when + 0.03);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
      osc.connect(noteGain);
      noteGain.connect(filter);
      osc.start(when);
      osc.stop(when + duration + 0.05);
    }
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
    this.padBus = null;
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
