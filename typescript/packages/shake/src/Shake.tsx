import type { CSSProperties, ReactNode } from "react";
import "./styles.css";
import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";

type ShakeProps = {
  distance: number;
  children: ReactNode;
};

export const Shake = ({ distance, children }: ShakeProps) => {
  return (
    <div
      className={combineStringsWithSpaces(
        dynatic`
          width: fit-content;
        `,
        "shake",
      )}
      style={{ "--shake": `${distance}px` } as CSSProperties}
    >
      {children}
    </div>
  );
};
