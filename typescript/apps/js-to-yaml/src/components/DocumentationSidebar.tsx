import { usePathState } from "@packages/router";
import { StyledLink } from "../customizedComponents/StyledLink";
import { type CSSProperties } from "react";
import {
  GroupedSidebar,
  type LinkGroupProperties,
  MobileGroupedSidebar,
  type MobileGroupedSidebarProps,
} from "@packages/sidebar";

const links: LinkGroupProperties[] = [
  {
    title: "Getting Started",
    links: [
      {
        label: "Introduction",
        pathname: "/documentation",
      },
      {
        label: "Quick Start",
        pathname: "/documentation/quickstart",
      },
    ],
  },
  {
    title: "YAML",
    links: [
      {
        label: "Convert to YAML",
        pathname: "/documentation/converttoyaml",
      },
    ],
  },
  {
    title: "Javascript",
    links: [
      {
        label: "Convert to Javascript",
        pathname: "/documentation/converttojavascript",
      },
    ],
  },
];

type DocumentationSidebarProps = {
  className?: string;
  style?: CSSProperties;
  titleClassName?: string;
  titleStyle?: CSSProperties;
  linkClassName?: string;
  linkStyle?: CSSProperties;
};

export const DocumentationSidebar = ({
  className,
  style,
  titleClassName,
  titleStyle,
  linkClassName,
  linkStyle,
}: DocumentationSidebarProps) => {
  const { path } = usePathState();

  return (
    <GroupedSidebar
      links={links}
      className={className}
      style={style}
      titleClassName={titleClassName}
      titleStyle={titleStyle}
      linkContent={({ label, pathname }) => (
        <StyledLink
          label={label}
          path={path}
          pathname={pathname}
          className={linkClassName}
          style={linkStyle}
        />
      )}
    />
  );
};

export const MobileDocumentationSidebar = ({
  className,
  style,
  titleClassName,
  titleStyle,
  linkClassName,
  linkStyle,
  burgerClassName,
  burgerStyle,
  burgerLineClassName,
  burgerLineStyle,
  contentContainerClassName,
  contentContainerStyle,
}: Omit<
  MobileGroupedSidebarProps,
  "links" | "linkClassName" | "linkStyle" | "closeOnLinkClick" | "linkContent"
> & {
  linkClassName?: string;
  linkStyle?: CSSProperties;
}) => {
  const { path } = usePathState();

  if (!path.startsWith("/documentation")) {
    return null;
  }

  return (
    <MobileGroupedSidebar
      links={links}
      className={className}
      style={style}
      titleClassName={titleClassName}
      titleStyle={titleStyle}
      linkContent={({ label, pathname, onLinkClick }) => (
        <StyledLink
          label={label}
          path={path}
          pathname={pathname}
          className={linkClassName}
          style={linkStyle}
          onClickCallback={() => onLinkClick?.({ pathname })}
        />
      )}
      closeOnLinkClick
      burgerClassName={burgerClassName}
      burgerStyle={burgerStyle}
      burgerLineClassName={burgerLineClassName}
      burgerLineStyle={burgerLineStyle}
      contentContainerClassName={contentContainerClassName}
      contentContainerStyle={contentContainerStyle}
    />
  );
};
