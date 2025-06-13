type InterpolateColorArgs = {
  from: string;
  to: string;
  progress: number;
};

export const interpolateColor = ({ from, to, progress }: InterpolateColorArgs) => {
  const parse = (hsl: string) => hsl.match(/[\d.]+/g)?.map(Number) ?? [];

  const fromParts = parse(from);
  const toParts = parse(to);

  const result = fromParts.map((v, i) => v + (toParts[i] - v) * progress);

  return `hsl(${result[0]} ${result[1]}% ${result[2]}% / ${result[3]})`;
};

type InterpolateNumberArgs = {
  from: number;
  to: number;
  progress: number;
};

const interpolateNumber = ({ from, to, progress }: InterpolateNumberArgs) => {
  return from + (to - from) * progress;
};

type InterpolateHueArgs = {
  from: number;
  to: number;
  progress: number;
};

const interpolateHue = ({ from, to, progress }: InterpolateHueArgs) => {
  const delta = ((to - from + 180) % 360) - 180;

  return (from + delta * progress + 360) % 360;
};

type InterpolateHSLArgs = {
  from: string;
  to: string;
  progress: number;
};

export const interpolateHSL = ({ from, to, progress }: InterpolateHSLArgs) => {
  const parse = (hsl: string) => hsl.match(/[\d.]+/g)?.map(Number) ?? [];

  const [h1, s1, l1, a1] = parse(from);
  const [h2, s2, l2, a2] = parse(to);

  const h = interpolateHue({ from: h1, to: h2, progress });
  const s = interpolateNumber({ from: s1, to: s2, progress });
  const l = interpolateNumber({ from: l1, to: l2, progress });
  const a = interpolateNumber({ from: a1 ?? 1, to: a2 ?? 1, progress });

  return `hsl(${h.toFixed(1)} ${s.toFixed(1)}% ${l.toFixed(1)}% / ${a.toFixed(3)})`;
};
