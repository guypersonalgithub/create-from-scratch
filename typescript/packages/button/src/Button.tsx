import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { type ButtonHTMLAttributes, type CSSProperties, type ReactNode, useState } from "react";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export const Button = ({ className, children, ...rest }: ButtonProps) => {
  return (
    <button
      {...rest}
      className={combineStringsWithSpaces(
        dynatic`
          cursor: pointer;
        `,
        className,
      )}
    >
      {children}
    </button>
  );
};
