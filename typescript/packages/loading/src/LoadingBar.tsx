import { type CSSProperties } from "react";
import "./styles.css";

type LoadingBarProps = {
  height?: number | `${number}%`;
  width?: number | `${number}%`;
  borderRadius?: number;
  backgroundColor: CSSProperties["background"];
  color: CSSProperties["background"];
  barWidth?: number | `${number}%`;
};

export const LoadingBar = ({
  height = "100%",
  width = "100%",
  borderRadius,
  backgroundColor,
  color,
  barWidth = "20%",
}: LoadingBarProps) => {
  return (
    <div
      style={{
        position: "relative",
        height: typeof height === "string" && height.includes("%") ? height : `${height}px`,
        width: typeof width === "string" && width.includes("%") ? width : `${width}px`,
        borderRadius: `${borderRadius}px`,
        background: backgroundColor,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          height: typeof height === "string" && height.includes("%") ? height : `${height}px`,
          width:
            typeof barWidth === "string" && barWidth.includes("%") ? barWidth : `${barWidth}px`,
          borderRadius: `${borderRadius}px`,
          transform: "translateX(-500%)",
          background: color,
        }}
        className="loading-bar"
      />
    </div>
  );
};
