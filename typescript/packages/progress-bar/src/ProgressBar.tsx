import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { type CSSProperties } from "react";

type ProgressBarProps = {
  className?: string;
  style?: CSSProperties;
  innerClassName?: string;
  innerStyle?: CSSProperties;
  progress: number;
};

export const ProgressBar = ({
  className,
  style,
  innerClassName,
  innerStyle,
  progress,
}: ProgressBarProps) => {
  return (
    <div
      className={combineStringsWithSpaces(
        dynatic`
          overflow: hidden;
        `,
        className,
      )}
      style={style}
    >
      <div
        className={combineStringsWithSpaces(
          dynatic`
            width: ${progress}%;
          `,
          innerClassName,
        )}
        style={innerStyle}
      />
    </div>
  );
};
