import type { ReactNode } from "react";
import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";

type AnimatedUnderlineProps = {
  className?: string;
  underlineClassName?: string;
  children: ReactNode;
};

export const AnimatedUnderline = ({
  className,
  underlineClassName,
  children,
}: AnimatedUnderlineProps) => {
  return (
    <div
      className={combineStringsWithSpaces(
        dynatic`
            position: relative;
            width: fit-content;
        `,
        className,
      )}
    >
      {children}
      <div
        className={combineStringsWithSpaces(
          dynatic`
            height: 2px;
            transform-origin: left;
            transform: scaleX(0%);
            transition: transform 0.5s ease;
          `,
          underlineClassName,
        )}
      />
    </div>
  );
};
