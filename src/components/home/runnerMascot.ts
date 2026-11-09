/**
 * The mascot as the runner's player, drawn in profile facing the run: big
 * glossy head with the black swept-back pattern pointing to the forehead, one
 * large eye, the black vest over the shoulders and down the chest, short
 * jointed limbs, and the orange light it stands in.
 *
 * Everything is in canvas pixels with the feet at the origin. The figure is
 * MASCOT_HEIGHT tall, a little taller than the game's hit box, which only
 * ever forgives.
 */

export const MASCOT_HEIGHT = 46;

/** What the drawing needs to know about the player this frame. */
export interface MascotPose {
  /** Run cycle angle in radians: one full turn is two steps. */
  stride: number;
  /** How fast `stride` turns, in rad/s; ages the dust. */
  strideRate: number;
  /** Ground speed in px/s; the dust stays where it was kicked up. */
  speed: number;
  running: boolean;
  grounded: boolean;
  ducking: boolean;
  /** Vertical speed in px/s, negative going up. */
  vy: number;
  /** Progress of the double jump's flip, 0 to 1, or null when not flipping. */
  flip: number | null;
  crashed: boolean;
  /** After a crash, how far it has fallen over: 0 at the hit, 1 lying flat. */
  fall: number;
}

const COLOURS = {
  white: "#f6f3ee",
  shade: "#c4bdb1",
  black: "#151515",
  iris: "#9a531f",
  glow: "rgba(242, 115, 19, 0.85)",
  rim: "rgba(242, 115, 19, 0.75)",
  dust: "rgba(244, 243, 239, 0.55)",
};

/** Body landmarks, before any bounce or lean. */
const HIP_Y = -9.5;
const THIGH = 5.2;
const SHIN = 5.2;
const SHOULDER = { x: 1.5, y: -20.5 };
const UPPER_ARM = 4.4;
const FOREARM = 4;
const BODY = { x: 0, y: -16.5, rx: 8, ry: 9 };
const HEAD = { x: 3, y: -33, r: 13 };

/** How far a foot travels back and forth under its hip, and how high it
 *  lifts on the way forward. */
const STEP_BACK = 4;
const STEP_FRONT = 5.5;
const STEP_LIFT = 4.5;

type Point = { x: number; y: number };

const mix = (a: number, b: number, k: number) => a + (b - a) * k;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** Where a foot is in its cycle: swinging forward in the air for the first
 *  half turn, planted and sweeping back for the second. */
function footInCycle(hipX: number, phase: number): Point {
  const p = ((phase % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  const reach = (STEP_FRONT + STEP_BACK) / 2;
  const centre = (STEP_FRONT - STEP_BACK) / 2;
  const x = hipX + centre - Math.cos(p) * reach;
  const y = p < Math.PI ? -Math.sin(p) * STEP_LIFT : 0;
  return { x, y };
}

/** Two-bone leg: the knee always bends forward, the way the mascot runs. A
 *  foot out of reach is simply left hanging at the end of the leg. */
function knee(hip: Point, foot: Point): { knee: Point; foot: Point } {
  const dx = foot.x - hip.x;
  const dy = foot.y - hip.y;
  const reach = THIGH + SHIN - 0.01;
  let d = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx);
  let end = foot;
  if (d > reach) {
    d = reach;
    end = { x: hip.x + Math.cos(angle) * d, y: hip.y + Math.sin(angle) * d };
  }
  d = Math.max(d, 0.5);
  const bend = Math.acos(clamp((THIGH * THIGH + d * d - SHIN * SHIN) / (2 * THIGH * d), -1, 1));
  return {
    knee: { x: hip.x + Math.cos(angle - bend) * THIGH, y: hip.y + Math.sin(angle - bend) * THIGH },
    foot: end,
  };
}

function stroke(ctx: CanvasRenderingContext2D, points: Point[], width: number, colour: string): void {
  ctx.strokeStyle = colour;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (const point of points.slice(1)) ctx.lineTo(point.x, point.y);
  ctx.stroke();
}

function drawLeg(ctx: CanvasRenderingContext2D, hip: Point, target: Point, colour: string): void {
  const leg = knee(hip, target);
  stroke(ctx, [hip, leg.knee, leg.foot], 4.2, colour);
  // A rounded foot, toe forward.
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.ellipse(leg.foot.x + 1, leg.foot.y - 0.4, 2.7, 1.8, 0, 0, Math.PI * 2);
  ctx.fill();
}

/** An arm from the shoulder: `swing` is the upper arm's angle from hanging
 *  straight down (positive forward), `bend` how far the forearm folds up. */
function drawArm(ctx: CanvasRenderingContext2D, shoulder: Point, swing: number, bend: number, colour: string): void {
  const elbow = {
    x: shoulder.x + Math.sin(swing) * UPPER_ARM,
    y: shoulder.y + Math.cos(swing) * UPPER_ARM,
  };
  const hand = {
    x: elbow.x + Math.sin(swing + bend) * FOREARM,
    y: elbow.y + Math.cos(swing + bend) * FOREARM,
  };
  // A darker edge first, so a white arm still reads over the white body.
  stroke(ctx, [shoulder, elbow, hand], 4.6, colour === COLOURS.white ? COLOURS.shade : "#8f887d");
  stroke(ctx, [shoulder, elbow, hand], 3.2, colour);
}

/** Dust kicked up by each foot as it lands, left behind at ground speed. */
function drawDust(ctx: CanvasRenderingContext2D, pose: MascotPose, hips: number[]): void {
  ctx.fillStyle = COLOURS.dust;
  hips.forEach((hipX, leg) => {
    const p = (((pose.stride + leg * Math.PI) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    if (p < Math.PI) return;
    const age = (p - Math.PI) / Math.PI;
    const drift = (pose.speed * (p - Math.PI)) / Math.max(pose.strideRate, 1);
    const x = hipX + STEP_FRONT - drift;
    ctx.globalAlpha = (1 - age) * 0.8;
    for (let i = 0; i < 2; i++) {
      ctx.beginPath();
      ctx.arc(x - i * 3, -1.2 - age * (2.5 + i * 1.5), 0.9 + age * (1.4 + i * 0.4), 0, Math.PI * 2);
      ctx.fill();
    }
  });
  ctx.globalAlpha = 1;
}

function drawBody(ctx: CanvasRenderingContext2D, squash: number): void {
  const rx = BODY.rx * (2 - squash);
  const ry = BODY.ry * squash;
  const body = ctx.createRadialGradient(BODY.x + 4, BODY.y - 5, 1, BODY.x, BODY.y, 11);
  body.addColorStop(0, "#ffffff");
  body.addColorStop(1, COLOURS.shade);
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(BODY.x, BODY.y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = body;
  ctx.fill();
  ctx.clip();
  // The vest: black over the shoulders and in a point down the chest.
  ctx.fillStyle = COLOURS.black;
  ctx.beginPath();
  ctx.moveTo(-10, -28);
  ctx.lineTo(11, -28);
  ctx.lineTo(11, -19);
  ctx.lineTo(7, -9);
  ctx.lineTo(2.5, -19.5);
  ctx.lineTo(-10, -20.5);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawHead(ctx: CanvasRenderingContext2D, crashed: boolean): void {
  const { x, y, r } = HEAD;
  const head = ctx.createRadialGradient(x + 5, y - 7, 1, x, y, r + 1);
  head.addColorStop(0, "#ffffff");
  head.addColorStop(0.55, "#efebe4");
  head.addColorStop(1, COLOURS.shade);
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = head;
  ctx.fill();
  ctx.clip();

  // The swept-back pattern, all pointing to the forehead: a black crest
  // along the top of the head, and two pointed strands sweeping back along
  // its side with white between them.
  const fx = x + 10.8;
  const fy = y - 7;
  ctx.fillStyle = COLOURS.black;
  ctx.beginPath();
  ctx.moveTo(fx, fy);
  ctx.quadraticCurveTo(x + 1, y - 8, x - 10.5, y - 1.5);
  ctx.lineTo(x - 15, y + 1);
  ctx.lineTo(x - 15, y - 16);
  ctx.lineTo(x + 15, y - 16);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(fx - 0.3, fy + 1.4);
  ctx.quadraticCurveTo(x - 1, y - 3.5, x - 13.5, y + 5.5);
  ctx.quadraticCurveTo(x - 1, y + 1.5, fx - 0.3, fy + 1.4);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 3, y + 0.8);
  ctx.quadraticCurveTo(x - 3, y + 2.5, x - 11.5, y + 11);
  ctx.quadraticCurveTo(x - 3, y + 6.5, x + 3, y + 0.8);
  ctx.fill();
  // Gloss.
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.ellipse(x + 4, y - 9, 4, 1.6, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Rim light on the back of the head.
  ctx.strokeStyle = COLOURS.rim;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(x, y, r - 0.4, Math.PI * 0.62, Math.PI * 1.35);
  ctx.stroke();

  // Eye: big and dark with a warm iris and a highlight, or a cross once it
  // has crashed.
  const ex = x + 7;
  const ey = y + 2;
  if (crashed) {
    ctx.strokeStyle = COLOURS.black;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(ex - 1.9, ey - 2);
    ctx.lineTo(ex + 1.9, ey + 2);
    ctx.moveTo(ex + 1.9, ey - 2);
    ctx.lineTo(ex - 1.9, ey + 2);
    ctx.stroke();
  } else {
    ctx.fillStyle = COLOURS.black;
    ctx.beginPath();
    ctx.ellipse(ex, ey, 3, 4.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLOURS.iris;
    ctx.beginPath();
    ctx.ellipse(ex + 0.4, ey + 1, 2, 2.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLOURS.black;
    ctx.beginPath();
    ctx.ellipse(ex + 0.6, ey + 0.7, 1.2, 1.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(ex - 0.9, ey - 1.6, 1.1, 0, Math.PI * 2);
    ctx.fill();
  }

  // Smile.
  ctx.strokeStyle = COLOURS.black;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + 8, y + 9.4);
  ctx.quadraticCurveTo(x + 9.6, y + 11, x + 11, y + 9);
  ctx.stroke();
}

/**
 * The slide that replaces the duck: leaning right back on the hip, feet
 * first, low enough to pass under anything a duck passes under. The upper
 * body turns back around the hip and shrinks a little; the feet are aimed at
 * points on the ground, carried into that turned frame.
 */
const SLIDE = { pivot: { x: -1, y: -4.5 }, angle: -1.3, scale: 0.85 };
const SLIDE_FEET = [
  { x: 10, y: -2.5 },
  { x: 5.5, y: -0.5 },
];

function intoSlide(point: Point): Point {
  const dx = (point.x - SLIDE.pivot.x) / SLIDE.scale;
  const dy = (point.y - SLIDE.pivot.y) / SLIDE.scale;
  const c = Math.cos(-SLIDE.angle);
  const s = Math.sin(-SLIDE.angle);
  return { x: dx * c - dy * s, y: dx * s + dy * c + HIP_Y };
}

/** Dust sprayed up at the feet of the slide, streaming back along the line. */
function drawSlideDust(ctx: CanvasRenderingContext2D, stride: number): void {
  ctx.fillStyle = COLOURS.dust;
  for (let i = 0; i < 6; i++) {
    const age = ((stride / (Math.PI * 2)) * 1.5 + i / 6) % 1;
    ctx.globalAlpha = (1 - age) * 0.75;
    ctx.beginPath();
    ctx.arc(9 - age * 42, -1 - age * 6 - (i % 2) * 2, 1 + age * 2.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/** Lying on its back, the head would sink below the line: this is how far
 *  the figure is raised once it has tipped flat, so the head rests on it. */
const KNOCKED_OUT_RAISE = 10;

/**
 * Draws the mascot with its feet at (x, y).
 *
 * Running, the feet trace a loop under the hips, knees bending forward, the
 * body dropping onto each step and lifting between them, the arms pumping
 * against the legs and the head following the bounce a beat late. In the air
 * it tucks its knees on the way up and reaches for the ground on the way
 * down; a double jump turns it in a forward flip. Ducking, it slides feet
 * first in a spray of dust. When it crashes it tips over onto its back, legs
 * in the air, with a crossed eye.
 */
export function drawMascot(ctx: CanvasRenderingContext2D, x: number, y: number, pose: MascotPose): void {
  const { stride, running, grounded, crashed } = pose;
  const sliding = running && grounded && pose.ducking && !crashed;
  const onTheRun = running && grounded && !crashed && !sliding;
  const airborne = !grounded && !crashed;
  const hips = [1.5, -1.5];

  // Lowest on each planted foot, highest between steps.
  const bounce = onTheRun ? (1 + Math.cos(2 * stride)) * 1.5 : 0;
  const headLag = onTheRun ? (1 + Math.cos(2 * stride - 0.9)) * 0.5 : 0;
  const squash = onTheRun ? 1 - (1 - Math.cos(2 * stride)) * 0.025 : 1;

  // Feet, as points in the figure's own frame, and arms as [swing, bend].
  let feet: Point[];
  let arms: Array<[number, number]>;
  if (crashed) {
    feet = [
      { x: 8, y: -6 },
      { x: 6.5, y: -4 },
    ];
    arms = [
      [2.6, 0.2],
      [-2.4, 0.2],
    ];
  } else if (sliding) {
    feet = SLIDE_FEET.map(intoSlide);
    arms = [
      [2.2, 0.3],
      [-2.58, 0.2],
    ];
  } else if (airborne) {
    // 0 rising fast, 1 falling fast.
    const k = clamp((pose.vy + 450) / 900, 0, 1);
    feet = [
      { x: mix(4, 3, k), y: mix(-5, 0, k) },
      { x: mix(-4, -2, k), y: mix(-2.5, 0, k) },
    ];
    arms = [
      [mix(2.7, 1.9, k), 0.4],
      [mix(-2.5, -1.4, k), 0.4],
    ];
  } else if (onTheRun) {
    feet = hips.map((hipX, leg) => footInCycle(hipX, stride + leg * Math.PI));
    const pump = Math.cos(stride) * 0.95;
    arms = [
      [pump, 1.5],
      [-pump, 1.5],
    ];
  } else {
    feet = hips.map((hipX) => ({ x: hipX + 0.5, y: 0 }));
    arms = [
      [0.15, 0.3],
      [-0.15, 0.3],
    ];
  }

  ctx.save();
  ctx.translate(x, y);

  if (crashed) {
    // Tips back fast, lands on its back with a little bounce.
    const tip = 1 - (1 - clamp(pose.fall / 0.75, 0, 1)) ** 3;
    const angle = (-Math.PI / 2) * tip;
    const raise = KNOCKED_OUT_RAISE * clamp((-angle - 0.9) / (Math.PI / 2 - 0.9), 0, 1);
    const land = pose.fall > 0.75 ? Math.sin(((pose.fall - 0.75) / 0.25) * Math.PI) * 1.5 : 0;
    ctx.translate(0, -raise - land);
    ctx.rotate(angle);
  } else if (sliding) {
    ctx.translate(SLIDE.pivot.x, SLIDE.pivot.y);
    ctx.scale(SLIDE.scale, SLIDE.scale);
    ctx.rotate(SLIDE.angle);
    ctx.translate(0, -HIP_Y);
  } else {
    if (onTheRun) drawDust(ctx, pose, hips);
    let tilt = 0;
    if (airborne) tilt = 0.08 + clamp(pose.vy / 3000, -0.2, 0.22);
    else if (running) tilt = 0.17;
    ctx.rotate(tilt);
    if (pose.flip !== null) {
      // Ease out: fast into the turn, settling on the way out.
      const turn = 1 - (1 - pose.flip) ** 3;
      ctx.translate(0, BODY.y);
      ctx.rotate(turn * Math.PI * 2);
      ctx.translate(0, -BODY.y);
    }
  }

  // When the body lifts, the hips lift with it and the legs stretch to keep
  // the planted foot on the line.
  const lift = -bounce;
  const hipPoints = hips.map((hipX) => ({ x: hipX, y: HIP_Y + lift }));
  const shoulder = { x: SHOULDER.x, y: SHOULDER.y + lift };

  // Far side first, in shade.
  drawLeg(ctx, hipPoints[1], feet[1], COLOURS.shade);
  drawArm(ctx, shoulder, arms[1][0], arms[1][1], COLOURS.shade);
  drawLeg(ctx, hipPoints[0], feet[0], COLOURS.white);

  ctx.save();
  ctx.translate(0, lift);
  // The orange light around it: a glowing silhouette under the shaded fills.
  ctx.save();
  ctx.shadowColor = COLOURS.glow;
  ctx.shadowBlur = 8;
  ctx.fillStyle = COLOURS.white;
  ctx.beginPath();
  ctx.ellipse(BODY.x, BODY.y, BODY.rx, BODY.ry, 0, 0, Math.PI * 2);
  ctx.moveTo(HEAD.x + HEAD.r, HEAD.y + headLag);
  ctx.arc(HEAD.x, HEAD.y + headLag, HEAD.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  drawBody(ctx, squash);
  ctx.save();
  ctx.translate(0, headLag);
  drawHead(ctx, crashed);
  ctx.restore();
  ctx.restore();

  // Near arm last, over the body, from a black shoulder.
  drawArm(ctx, shoulder, arms[0][0], arms[0][1], COLOURS.white);
  ctx.fillStyle = COLOURS.black;
  ctx.beginPath();
  ctx.arc(shoulder.x, shoulder.y + 0.5, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // The slide's dust goes over it: kicked up at the feet, streaming back.
  if (sliding) {
    ctx.save();
    ctx.translate(x, y);
    drawSlideDust(ctx, stride);
    ctx.restore();
  }
}
