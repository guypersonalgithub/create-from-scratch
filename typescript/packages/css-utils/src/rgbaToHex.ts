type RgbaToHexArgs = {
  rgba: string;
};

export const rgbaToHex = ({ rgba }: RgbaToHexArgs) => {
  const regex =
    /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(\d*(?:\.\d+)?))?\s*\)$/;

  const match = rgba.match(regex);
  if (!match) {
    return "";
  }

  const r = Math.min(255, parseInt(match[1], 10));
  const g = Math.min(255, parseInt(match[2], 10));
  const b = Math.min(255, parseInt(match[3], 10));
  const a = match[4] !== undefined ? Math.round(parseFloat(match[4]) * 255) : null;

  const toHex = (n: number) => n.toString(16).padStart(2, "0");

  return ("#" + toHex(r) + toHex(g) + toHex(b) + (a !== null ? toHex(a) : "")).toLowerCase();
};
