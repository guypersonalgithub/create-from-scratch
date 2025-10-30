import { SpreaderTitle } from "@packages/title";
import { type ReactNode } from "react";
import { dynatic } from "../dynatic-css.config";

type StyledTitleProps = {
  children: ReactNode;
};

export const StyledTitle = ({ children }: StyledTitleProps) => {
  return (
    <SpreaderTitle
      className={dynatic`
        color: ${(config) => config.colors.mainColor};
        transition: ${(config) => config.shared.defaultTransition};
      `}
    >
      {children}
    </SpreaderTitle>
  );
};

export const StyledSubTitle = ({ children }: StyledTitleProps) => {
  return <h2>{children}</h2>;
};
