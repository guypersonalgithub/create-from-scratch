import { type CSSProperties, type ReactNode } from "react";
import { dynatic } from "@packages/dynatic-css";

type SpreaderTitleProps = {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

export const SpreaderTitle = ({ className, style, children }: SpreaderTitleProps) => {
  const baseClass = dynatic`
      font-size: 30px;
      font-weight: bold;
    `;

  // combineStringsWithSpaces

  return (
    <div className={className ? `${baseClass} ${className}` : baseClass} style={style}>
      {children}
      <hr />
    </div>
  );
};
