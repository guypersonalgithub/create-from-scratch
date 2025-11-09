type DarkenHexColorArgs = {
  hex: string;
  reduceBy?: number;
};

export const darkenHexColor = ({ hex, reduceBy = 0.9 }: DarkenHexColorArgs) => {
  hex = hex.replace("#", "");

  let r = Number.parseInt(hex.substring(0, 2), 16);
  let g = Number.parseInt(hex.substring(2, 4), 16);
  let b = Number.parseInt(hex.substring(4, 6), 16);

  // Darken by reducing each component.
  r = Math.max(0, Math.floor(r * reduceBy));
  g = Math.max(0, Math.floor(g * reduceBy));
  b = Math.max(0, Math.floor(b * reduceBy));

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};
