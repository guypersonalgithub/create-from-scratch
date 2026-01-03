import type { CSSProperties } from "react";

export type ProgressBarProps = {
  className?: string;
  style?: CSSProperties;
  innerClassName?: string;
  innerStyle?: CSSProperties;
  progress: number;
  initiallyAnimated?: boolean;
};
