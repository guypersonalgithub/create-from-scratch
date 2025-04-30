import { CSSProperties, ReactNode } from "react";
import { usePath } from "./usePath";

type LinkProps = {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
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

export const Link = ({ pathname, href, children, style, className }: CompleteLinkProps) => {
  if (pathname) {
    return (
      <InternalLink pathname={pathname} style={style} className={className}>
        {children}
      </InternalLink>
    );
  }

  if (href) {
    return (
      <ExternalLink href={href} style={style} className={className}>
        {children}
      </ExternalLink>
    );
  }

  return null;
};

const InternalLink = ({ pathname, children, style, className }: InternalLinkProps) => {
  const { moveTo } = usePath();

  return (
    <a
      className={className}
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

const ExternalLink = ({ href, children, style, className }: ExternalLinkProps) => {
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer" style={style}>
      {children}
    </a>
  );
};
