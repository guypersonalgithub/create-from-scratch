type HslToHexArgs = {
  hsl: string;
};

export const hslToHex = ({ hsl }: HslToHexArgs) => {
  const regex =
    /^hsla?\(\s*(-?\d+(?:\.\d+)?)\s*(?:,|\s)\s*(\d+(?:\.\d+)?)%\s*(?:,|\s)\s*(\d+(?:\.\d+)?)%\s*(?:\/\s*([\d.]+))?\s*\)$/;

  const match = hsl.match(regex);
  if (!match) {
    return "";
  }

  let [_, h, s, l, a] = match;

  let hue = ((parseFloat(h) % 360) + 360) % 360; // normalize negative hues
  let sat = parseFloat(s) / 100;
  let light = parseFloat(l) / 100;

  let c = (1 - Math.abs(2 * light - 1)) * sat;
  let x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  let m = light - c / 2;

  let [r, g, b] = [0, 0, 0];

  if (hue < 60) [r, g, b] = [c, x, 0];
  else if (hue < 120) [r, g, b] = [x, c, 0];
  else if (hue < 180) [r, g, b] = [0, c, x];
  else if (hue < 240) [r, g, b] = [0, x, c];
  else if (hue < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  const toHex = (val: number) =>
    Math.round((val + m) * 255)
      .toString(16)
      .padStart(2, "0");

  const alpha =
    a !== undefined
      ? Math.round(parseFloat(a) * 255)
          .toString(16)
          .padStart(2, "0")
      : "";

  return `#${toHex(r)}${toHex(g)}${toHex(b)}${alpha}`.toLowerCase();
};
