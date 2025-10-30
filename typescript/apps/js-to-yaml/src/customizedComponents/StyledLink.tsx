import { Link } from "@packages/router";
import { type CSSProperties } from "react";
import { dynatic } from "../dynatic-css.config";
import { combineStringsWithSpaces } from "@packages/string-utils";

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
  className,
  style,
  selectedCondition,
  onClickCallback,
}: StyledLinkProps) => {
  return (
    <Link
      key={pathname}
      className={combineStringsWithSpaces(
        dynatic`
          color: ${(config) => config.colors.mainColor};
          text-decoration: none;
          cursor: pointer;
          transition: ${(config) => config.shared.defaultTransition};
          font-weight: bold;

          &:hover {
            color: ${(config) => config.shared.linkColor};
          }
        `,
        (selectedCondition?.({ path, pathname }) ?? pathname === path) &&
          dynatic`
            color: ${(config) => config.shared.linkColor};
          `,
        className,
      )}
      style={style}
      pathname={pathname}
      onClick={onClickCallback}
    >
      {label}
    </Link>
  );
};
