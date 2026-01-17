import { AnimatedUnderline } from "@packages/animated-underline";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { dynatic } from "../dynatic-css.config";
import { ReactNode } from "react";

type StyledAnimatedUnderlineProps = {
  children: ReactNode;
};

export const StyledAnimatedUnderline = ({ children }: StyledAnimatedUnderlineProps) => {
  return (
    <AnimatedUnderline
      className={combineStringsWithSpaces(
        dynatic`
          ${(config) => config.utils.descendantSelector({ classNames: ["group:hover", "child--transform: scaleX(0%)"] })} {
            transform: scaleX(100%);
          }
        `,
        "group",
      )}
      underlineClassName={combineStringsWithSpaces(
        dynatic`
          background: #ff3b3b;
        `,
        "child",
      )}
    >
      {children}
    </AnimatedUnderline>
  );
};
