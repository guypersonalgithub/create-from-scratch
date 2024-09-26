import { ReactNode } from "react";
import { usePath } from "./usePath";

type LinkProps = {
  pathname: string;
  children: ReactNode;
};

export const Link = ({ pathname, children }: LinkProps) => {
  const { moveTo } = usePath();

  return (
    <a
      href={`${window.location.origin}${pathname}`}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        moveTo({ pathname });
      }}
    >
      {children}
    </a>
  );
};
