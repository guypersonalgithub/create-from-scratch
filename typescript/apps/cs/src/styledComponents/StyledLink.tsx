import { type CompleteLinkProps, Link } from "@packages/router";
import { dynatic } from "../dynatic-css.config";
import { combineStringsWithSpaces } from "@packages/string-utils";

type StyledLinkProps = CompleteLinkProps;

export const StyledLink = ({ className, ...props }: StyledLinkProps) => {
  return (
    <Link
      {...props}
      className={combineStringsWithSpaces(
        dynatic`
          color: #5662F6;
        `,
        className,
      )}
    />
  );
};
