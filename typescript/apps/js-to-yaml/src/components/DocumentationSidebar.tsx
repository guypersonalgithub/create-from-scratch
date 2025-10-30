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
  style?: CSSProperties;
  titleStyle?: CSSProperties;
  linkStyle?: CSSProperties;
};

export const DocumentationSidebar = ({
  style,
  titleStyle,
  linkStyle,
}: DocumentationSidebarProps) => {
  const { path } = usePathState();

  return (
    <GroupedSidebar
      links={links}
      style={style}
      titleStyle={titleStyle}
      linkContent={({ label, pathname }) => (
        <StyledLink label={label} path={path} pathname={pathname} style={linkStyle} />
      )}
    />
  );
};

export const MobileDocumentationSidebar = ({
  style,
  titleStyle,
  linkStyle,
  burgerStyle,
  burgerLineStyle,
  contentContainerStyle,
}: Omit<MobileGroupedSidebarProps, "links" | "linkStyle" | "closeOnLinkClick" | "linkContent"> & {
  linkStyle?: CSSProperties;
}) => {
  const { path } = usePathState();

  if (!path.startsWith("/documentation")) {
    return null;
  }

  return (
    <MobileGroupedSidebar
      links={links}
      style={style}
      titleStyle={titleStyle}
      linkContent={({ label, pathname, onLinkClick }) => (
        <StyledLink
          label={label}
          path={path}
          pathname={pathname}
          style={linkStyle}
          onClickCallback={() => onLinkClick?.({ pathname })}
        />
      )}
      closeOnLinkClick
      burgerStyle={burgerStyle}
      burgerLineStyle={burgerLineStyle}
      contentContainerStyle={contentContainerStyle}
    />
  );
};
