import { CSSProperties, ReactNode } from "react";
import { usePath } from "./usePath";
import { useScrollToTheTop } from "@packages/hooks";

type LinkProps = {
  children: ReactNode;
  style?: CSSProperties;
};

type InternalLinkProps = LinkProps & {
  pathname: string;
  href?: never;
};

type ExternalLinkProps = LinkProps & {
  pathname?: never;
  href: string;
};

export type CompleteLinkProps = InternalLinkProps | ExternalLinkProps;

export const Link = ({ pathname, href, children, style }: CompleteLinkProps) => {
  if (pathname) {
    return (
      <InternalLink pathname={pathname} style={style}>
        {children}
      </InternalLink>
    );
  }

  if (href) {
    return (
      <ExternalLink href={href} style={style}>
        {children}
      </ExternalLink>
    );
  }

  return null;
};

const InternalLink = ({ pathname, children, style }: InternalLinkProps) => {
  const { moveTo } = usePath();
  useScrollToTheTop();

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

const ExternalLink = ({ href, children, style }: ExternalLinkProps) => {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={style}>
      {children}
    </a>
  );
};
