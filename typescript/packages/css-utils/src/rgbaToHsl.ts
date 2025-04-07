type RgbaToHslArgs = {
  rgba: string;
};

export const rgbaToHsl = ({ rgba }: RgbaToHslArgs) => {
  const regex =
    /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(\d*(?:\.\d+)?))?\s*\)$/;
  const match = rgba.match(regex);

  if (!match) {
    return "";
  }

  let [_, rStr, gStr, bStr, aStr] = match;

  let r = parseInt(rStr) / 255;
  let g = parseInt(gStr) / 255;
  let b = parseInt(bStr) / 255;
  let a = aStr !== undefined ? parseFloat(aStr) : undefined;

  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let delta = max - min;

  let h = 0;
  let s = 0;
  let l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));

    switch (max) {
      case r:
        h = ((g - b) / delta + (g < b ? 6 : 0)) * 60;
        break;
      case g:
        h = ((b - r) / delta + 2) * 60;
        break;
      case b:
        h = ((r - g) / delta + 4) * 60;
        break;
    }
  }

  const round = (n: number) => Math.round(n * 100) / 100;

  if (a !== undefined && a < 1) {
    return `hsla(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%, ${round(a)})`;
  } else {
    return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  }
};
