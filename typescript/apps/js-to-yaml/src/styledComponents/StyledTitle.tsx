import { SpreaderTitle } from "@packages/title";
import { type ReactNode } from "react";

type StyledTitleProps = {
  children: ReactNode;
};

export const StyledTitle = ({ children }: StyledTitleProps) => {
  return (
    <SpreaderTitle
      style={{
        color: "var(--theme-color)",
        transition: "var(--theme-transition)",
      }}
    >
      {children}
    </SpreaderTitle>
  );
};

export const StyledSubTitle = ({ children }: StyledTitleProps) => {
  return <h2>{children}</h2>;
};
