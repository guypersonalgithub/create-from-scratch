import type { CSSProperties } from "react";

export type ConfettiDisplayProps = {
  id: string;
  className?: string;
  style?: CSSProperties;
  x: number;
  y: number;
  particleCount?: number; // how many pieces per burst
  spread?: number; // angle spread in degrees
  size?: number; // rough particle size
  gravity?: number; // acceleration
  colors?: string[];
  baseAngle?: number;
};
