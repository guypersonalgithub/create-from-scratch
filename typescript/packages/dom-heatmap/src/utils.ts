import { type Color } from "./types";

type InterpolateColorArgs = {
  color1: Color;
  color2: Color;
  percentage: number;
};

export const interpolateColor = ({ color1, color2, percentage }: InterpolateColorArgs) => {
  const result = color1.slice();
  for (let i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + percentage * (color2[i] - color1[i]));
  }

  return `rgb(${result.join(",")})`;
};

type GetHeatmapColorArgs = {
  value: number;
  color1: Color;
  color2: Color;
  color3: Color;
};

export const getHeatmapColor = ({ value, color1, color2, color3 }: GetHeatmapColorArgs) => {
  if (value < 0) {
    const percentage = (value + 100) / 100; // maps [-100, 0] → [0, 1]

    return interpolateColor({ color1: color3, color2: color1, percentage });
  } else {
    const percentage = value / 100; // maps [0, 100] → [0, 1]

    return interpolateColor({ color1, color2, percentage });
  }
};
