import { type CSSProperties, type ReactNode } from "react";
import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";

type SpreaderTitleProps = {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

export const SpreaderTitle = ({ className, style, children }: SpreaderTitleProps) => {
  return (
    <div
      className={combineStringsWithSpaces(
        dynatic`
      font-size: 30px;
      font-weight: bold;
    `,
        className,
      )}
      style={style}
    >
      {children}
      <hr />
    </div>
  );
};
