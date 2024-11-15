import { CSSProperties, ReactNode } from "react";
import { usePath } from "./usePath";

type LinkProps = {
  pathname: string;
  children: ReactNode;
  style?: CSSProperties;
};

export const Link = ({ pathname, children, style }: LinkProps) => {
  const { moveTo } = usePath();

  return (
    <a
      href={`${window.location.origin}${pathname}`}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        moveTo({ pathname });
      }}
      style={style}
    >
      {children}
    </a>
  );
};
