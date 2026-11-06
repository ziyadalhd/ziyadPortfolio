const clamp = (value: number) => Math.max(0, Math.min(1, value));

function transition(progress: number, start: number, end: number) {
  const t = clamp((progress - start) / (end - start));
  return t * t * (3 - 2 * t);
}

/** Scrubs the bottle, stream and cup along one reversible scroll sequence. */
export function getPourFrame(progress: number) {
  const tilt = transition(progress, 0.05, 0.3);
  const settle = transition(progress, 0.73, 0.94);
  const fill = transition(progress, 0.3, 0.76);
  const reveal = transition(progress, 0.8, 1);
  const waterY = 27 - 20 * fill;
  const crest = waterY - Math.min(2, 27 - waterY, waterY - 5);
  return {
    angle: 122 * tilt * (1 - settle),
    spoutX: 205 + 160 * tilt * (1 - settle),
    spoutY: 90 + 50 * tilt,
    waterY,
    waterPath: `M0 ${waterY}H14V${crest}H20V${waterY}H32V32H0Z`,
    bottleWaterY: 13 + 28 * fill,
    stream:
      transition(progress, 0.28, 0.34) * (1 - transition(progress, 0.7, 0.77)),
    fill,
    reveal,
  };
}
