/**
 * A stack of text-shadows that extrudes type back into the dark, toward a
 * vanishing point: `dx` and `dy` give the direction of one step (a word left
 * of the vanishing point steps right, one to its right steps left). The first
 * layers are lit by the orange light rising from below and fade to ink.
 */
export function extrude({ dx = 0, dy = 1, steps = 14, unit = 1.1, warm = true }: {
  dx?: number;
  dy?: number;
  steps?: number;
  unit?: number;
  warm?: boolean;
}): string {
  const from = warm ? [74, 34, 10] : [44, 44, 45];
  const to = [12, 12, 13];
  const layers: string[] = [];
  for (let i = 1; i <= steps; i++) {
    const t = (i - 1) / Math.max(1, steps - 1);
    const c = from.map((v, k) => Math.round(v + (to[k] - v) * Math.pow(t, 0.7)));
    layers.push(`${(dx * i * unit).toFixed(2)}px ${(dy * i * unit).toFixed(2)}px 0 rgb(${c.join(" ")})`);
  }
  // A last soft shadow lands the block on the dark below it.
  layers.push(`${(dx * steps * unit).toFixed(1)}px ${(dy * steps * unit + 18).toFixed(1)}px 40px rgb(0 0 0 / 0.65)`);
  return layers.join(", ");
}
