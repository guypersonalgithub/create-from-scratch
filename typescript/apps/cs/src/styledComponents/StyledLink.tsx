import { CompleteLinkProps, Link } from "@packages/router";

type StyledLinkProps = CompleteLinkProps;

export const StyledLink = ({ style, ...props }: StyledLinkProps) => {
  return <Link {...props} style={{ ...style, color: "#5662F6" }} />;
};
