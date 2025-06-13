type HslToRgbaArgs = {
  hsl: string;
};

export const hslToRgba = ({ hsl }: HslToRgbaArgs) => {
  const regex =
    /^hsla?\(\s*(-?\d+(?:\.\d+)?)\s*(?:,|\s)\s*(\d+(?:\.\d+)?)%\s*(?:,|\s)\s*(\d+(?:\.\d+)?)%\s*(?:\/\s*([\d.]+))?\s*\)$/;

  const match = hsl.match(regex);

  if (!match) {
    return "";
  }

  const [_, hStr, sStr, lStr, aStr] = match;
  const h = ((parseFloat(hStr) % 360) + 360) % 360; // normalize hue
  const s = parseFloat(sStr) / 100;
  const l = parseFloat(lStr) / 100;
  const a = aStr !== undefined ? parseFloat(aStr) : 1;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let [r1, g1, b1] = [0, 0, 0];

  if (h < 60) [r1, g1, b1] = [c, x, 0];
  else if (h < 120) [r1, g1, b1] = [x, c, 0];
  else if (h < 180) [r1, g1, b1] = [0, c, x];
  else if (h < 240) [r1, g1, b1] = [0, x, c];
  else if (h < 300) [r1, g1, b1] = [x, 0, c];
  else [r1, g1, b1] = [c, 0, x];

  const r = Math.round((r1 + m) * 255);
  const g = Math.round((g1 + m) * 255);
  const b = Math.round((b1 + m) * 255);

  return `rgba(${r}, ${g}, ${b}, ${Math.round(a * 1000) / 1000})`;
};
