import { Link } from "@packages/router";
import { type CSSProperties } from "react";

type StyledLinkProps = {
  path: string;
  pathname: string;
  label: string;
  className?: string;
  style?: CSSProperties;
  selectedCondition?: (args: { path: string; pathname: string }) => boolean;
  onClickCallback?: () => void;
};

export const StyledLink = ({
  path,
  pathname,
  label,
  className = "link",
  style,
  selectedCondition,
  onClickCallback,
}: StyledLinkProps) => {
  return (
    <Link
      key={pathname}
      className={className}
      style={{
        cursor: "pointer",
        transition: "color 0.5s ease",
        fontWeight: "bold",
        color:
          (selectedCondition?.({ path, pathname }) ?? pathname === path)
            ? "rgb(25, 187, 187)"
            : undefined,
        ...style,
      }}
      pathname={pathname}
      onClick={onClickCallback}
    >
      {label}
    </Link>
  );
};
