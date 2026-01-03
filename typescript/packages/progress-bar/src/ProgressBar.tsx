import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { useEffect, useRef } from "react";
import type { ProgressBarProps } from "./types";

export const ProgressBar = ({
  className,
  style,
  innerClassName,
  innerStyle,
  progress,
  initiallyAnimated,
}: ProgressBarProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = ref.current;

    if (!bar || !initiallyAnimated) {
      return;
    }

    bar.style.transform = "scaleX(0%)";

    requestAnimationFrame(() => {
      bar.style.transform = `scaleX(${progress}%)`;
    });
  }, [progress, initiallyAnimated]);

  return (
    <div className={className} style={style}>
      <div
        ref={ref}
        className={combineStringsWithSpaces(
          dynatic`
            transform-origin: left;
            transition: transform 0.5s ease;
          `,
          innerClassName,
        )}
        style={
          !initiallyAnimated ? { ...innerStyle, transform: `scaleX(${progress}%)` } : innerStyle
        }
      />
    </div>
  );
};
