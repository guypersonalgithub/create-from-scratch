import { type CSSProperties } from "react";
import "./LoadingBar.styles.css";
import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";

type LoadingBarProps = {
  className?: string;
  barClassName?: string;
  height?: number | `${number}%`;
  width?: number | `${number}%`;
  borderRadius?: number;
  backgroundColor: CSSProperties["background"];
  color: CSSProperties["background"];
  barWidth?: number | `${number}%`;
};

export const LoadingBar = ({
  className,
  barClassName,
  height = "100%",
  width = "100%",
  borderRadius,
  backgroundColor,
  color,
  barWidth = "20%",
}: LoadingBarProps) => {
  return (
    <div
      className={combineStringsWithSpaces(
        dynatic`
          position: relative;
          overflow: hidden;
        `,
        typeof height === "string" && height.includes("%")
          ? dynatic`
              height: ${height};
            `
          : dynatic`
              height: ${height}px;
            `,
        typeof width === "string" && width.includes("%")
          ? dynatic`
              width: ${width};
            `
          : dynatic`
              width: ${width}px;
            `,
        borderRadius &&
          dynatic`
            border-radius: ${borderRadius}px; 
          `,
        backgroundColor &&
          dynatic`
            background: ${backgroundColor};
          `,
        className,
      )}
    >
      <div
        className={combineStringsWithSpaces(
          dynatic`
          position: absolute;
          top: 0;
          transform: translateX(-500%);
          animation: progress 3s ease-out infinite;
        `,
          typeof height === "string" && height.includes("%")
            ? dynatic`
                height: ${height};
              `
            : dynatic`
                height: ${height}px;
              `,
          typeof barWidth === "string" && barWidth.includes("%")
            ? dynatic`
                width: ${barWidth};
              `
            : dynatic`
                width: ${barWidth}px;
              `,
          borderRadius &&
            dynatic`
              border-radius: ${borderRadius}px; 
            `,
          color &&
            dynatic`
              background: ${color};
            `,
          barClassName,
        )}
      />
    </div>
  );
};
