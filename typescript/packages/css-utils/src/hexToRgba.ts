type HexToRgbaArgs = {
  hex: string;
  opacity?: number;
};

export const hexToRgba = ({ hex, opacity }: HexToRgbaArgs) => {
  // Expand short hex format (#RGB → #RRGGBB)
  if (hex.length === 4) {
    hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }

  // Ensure it's a valid hex color
  if (!/^#([0-9A-Fa-f]{6})$/.test(hex)) {
    return "";
    // throw new Error("Invalid hex color format");
  }

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  if (opacity !== undefined) {
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  return `rgb(${r}, ${g}, ${b})`;
};
