import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";
import type { CSSProperties } from "react";

type StaggeredTextProps = {
  className?: string;
  style?: CSSProperties;
  charClassName?: string;
  charStyle?: CSSProperties;
  children: string;
};

export const StaggeredText = ({
  className,
  style,
  charClassName,
  charStyle,
  children,
}: StaggeredTextProps) => {
  const splitChildren = children.split("");

  return (
    <div className={className} style={style}>
      {splitChildren.map((child, index) => {
        return (
          <span
            key={`${child}-${index}`}
            className={combineStringsWithSpaces(
              dynatic`
                transition: 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                width: fit-content;
                // pointer-events: none;
                display: inline-block;
              `,
              charClassName,
            )}
            style={{ ...charStyle, transitionDelay: `${index * 50}ms` }}
          >
            {child}
          </span>
        );
      })}
    </div>
  );
};
