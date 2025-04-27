import { CSSProperties } from "react";
import { Color } from "./types";
import { getHeatmapColor } from "./utils";

type DOMHeatmapProps = {
  style?: CSSProperties;
  color1: Color;
  color2: Color;
  color3: Color;
  x: string[];
  xStyle?: CSSProperties;
  y: string[];
  yStyle?: CSSProperties;
  data: number[][];
  dataStyle?: CSSProperties;
};

export const DOMHeatmap = ({
  style,
  color1,
  color2,
  color3,
  x,
  xStyle,
  y,
  yStyle,
  data,
  dataStyle,
}: DOMHeatmapProps) => {
  return (
    <table style={{ borderCollapse: "collapse", ...style }}>
      <thead>
        <tr>
          <td />
          {y.map((col) => {
            return (
              <td key={col} style={yStyle}>
                {col}
              </td>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {x.map((row, index) => {
          return (
            <tr key={row}>
              <td style={xStyle}>{row}</td>
              {y.map((_, yIndex) => {
                const value = data?.[index]?.[yIndex];
                const backgroundColor = getHeatmapColor({ value, color1, color2, color3 });
                return (
                  <td key={`${index},${yIndex}`} style={{ backgroundColor, ...dataStyle }}>
                    {value}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
