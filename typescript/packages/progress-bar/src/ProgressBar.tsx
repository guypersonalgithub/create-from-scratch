import { CSSProperties } from "react";

type ProgressBarProps = {
  style?: CSSProperties;
  innerStyle?: CSSProperties;
  progress: number;
};

export const ProgressBar = ({ style, innerStyle, progress }: ProgressBarProps) => {
  return (
    <div style={{ ...style, overflow: "hidden" }}>
      <div style={{ ...innerStyle, width: `${progress}%` }} />
    </div>
  );
};
