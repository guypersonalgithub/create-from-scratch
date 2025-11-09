import { type CSSProperties } from "react";
import { type Color } from "./types";
import { getHeatmapColor } from "./utils";
import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";

type DOMHeatmapProps = {
  className?: string;
  style?: CSSProperties;
  color1: Color;
  color2: Color;
  color3: Color;
  x: string[];
  xClassName?: string;
  xStyle?: CSSProperties;
  y: string[];
  yClassName?: string;
  yStyle?: CSSProperties;
  data: number[][];
  dataClassName?: string;
  dataStyle?: CSSProperties;
};

export const DOMHeatmap = ({
  className,
  style,
  color1,
  color2,
  color3,
  x,
  xClassName,
  xStyle,
  y,
  yClassName,
  yStyle,
  data,
  dataClassName,
  dataStyle,
}: DOMHeatmapProps) => {
  return (
    <table
      className={combineStringsWithSpaces(
        dynatic`
          border-collapse: collapse;
        `,
        className,
      )}
      style={style}
    >
      <thead>
        <tr>
          <td />
          {y.map((col) => {
            return (
              <td key={col} className={yClassName} style={yStyle}>
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
              <td className={xClassName} style={xStyle}>
                {row}
              </td>
              {y.map((_, yIndex) => {
                const value = data?.[index]?.[yIndex];
                const backgroundColor = getHeatmapColor({ value, color1, color2, color3 });

                return (
                  <td
                    key={`${index},${yIndex}`}
                    className={combineStringsWithSpaces(
                      dynatic`
                        background-color: ${backgroundColor};
                      `,
                      dataClassName,
                    )}
                    style={dataStyle}
                  >
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
