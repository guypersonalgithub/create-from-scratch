import { type ReactNode } from "react";
import { type Variants } from "./types";
import { getVariantclassNames } from "./utils";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { dynatic } from "@packages/dynatic-css";

type KeyProps = {
  variant?: Variants;
  interactive?: boolean;
  children: ReactNode;
};

export const Key = ({ variant = "basic", interactive, children }: KeyProps) => {
  return (
    <div
      className={combineStringsWithSpaces(
        getVariantclassNames({ variant }),
        interactive &&
          dynatic`
            &:active {
              transform: translateY(1px);
              box-shadow: inset 0 -1px 0 #999, 0 1px 3px rgba(0, 0, 0, 0.15);
            }  
          `,
      )}
    >
      {children}
    </div>
  );
};
