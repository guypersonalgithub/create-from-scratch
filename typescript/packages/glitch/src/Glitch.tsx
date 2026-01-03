import type { CSSProperties, ReactNode } from "react";
import "./styles.css";
import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";

type GlitchProps = {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

export const Glitch = ({ className, style, children }: GlitchProps) => {
  return (
    <div
      className={combineStringsWithSpaces(
        dynatic`
            width: fit-content;
            animation: glitchAnimation 1s infinite;
        `,
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
};
