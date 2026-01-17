import { dynatic } from "../dynatic-css.config";
import { combineStringsWithSpaces } from "@packages/string-utils";
import type { CSSProperties, ReactNode } from "react";

type GradientTitleProps = {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

export const GradientTitle = ({ className, style, children }: GradientTitleProps) => {
  return (
    <span
      className={combineStringsWithSpaces(
        dynatic`
            background: linear-gradient(90deg, #4f46e5, #10b981);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 2px 8px rgba(0,0,0,0.2);
            display: inline-block;
            color: #4f46e5; // fallback for browsers that don't support -webkit-background-clip: text.
        `,
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
};
