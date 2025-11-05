import { type CSSProperties } from "react";

// TODO: Finish the component, currently the implementation is unoptimized, so it is removed from git for the time being.

type Mode = "waves" | "noise" | "particles";

type ProceduralBackgroundProps = {
  className?: string;
  style?: CSSProperties;
  mode?: Mode;
  colors?: string[];
  speed?: number; // multiplier
  intensity?: number; // between 0 to 1
  particleCount?: number;
  seed?: number; // deterministic seed
};

export const ProceduralBackground = ({
  className,
  style,
  mode = "waves",
  colors = ["#0b1226", "#0b6dff"],
  speed = 1,
  intensity = 0.8,
  particleCount = 60,
  seed = Math.floor(Math.random() * 65536),
}: ProceduralBackgroundProps) => {
  return null;
};
