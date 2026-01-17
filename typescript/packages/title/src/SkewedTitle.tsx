import { type CSSProperties, type ReactNode } from "react";
import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";

type SkewedTitleProps = {
  className?: string;
  skewedClassName?: string;
  style?: CSSProperties;
  skewedStyle?: CSSProperties;
  title: ReactNode;
  skewed: ReactNode;
};

export const SkewedTitle = ({
  className,
  skewedClassName,
  style,
  skewedStyle,
  title,
  skewed,
}: SkewedTitleProps) => {
  return (
    <div
      className={dynatic`
        display: flex;
        align-items: center;
        flex-wrap: wrap;
      `}
    >
      <div className={className} style={style}>
        {title}
      </div>
      <div
        className={combineStringsWithSpaces(
          dynatic`
            transform: skewX(-10deg);
        `,
          skewedClassName,
        )}
        style={skewedStyle}
      >
        {skewed}
      </div>
    </div>
  );
};
