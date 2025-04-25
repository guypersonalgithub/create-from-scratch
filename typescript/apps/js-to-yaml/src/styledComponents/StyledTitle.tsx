import { SpreaderTitle } from "@packages/title";
import { ReactNode } from "react";

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
