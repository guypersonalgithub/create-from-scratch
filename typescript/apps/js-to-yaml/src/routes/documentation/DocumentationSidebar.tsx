import { usePathState } from "@packages/router";
import { StyledLink } from "../../styledComponents/StyledLink";
import { CSSProperties } from "react";

export type LinkGroup = { title: string; links: { label: string; pathname: string }[] };

type DocumentationSidebarProps = {
  links: LinkGroup[];
  style?: CSSProperties;
  titleStyle?: CSSProperties;
  linkStyle?: CSSProperties;
};

// TODO: Consider moving to an external package for it to be available for other workspaces.

export const DocumentationSidebar = ({
  links,
  style,
  titleStyle,
  linkStyle,
}: DocumentationSidebarProps) => {
  const { path } = usePathState();

  return (
    <div
      style={{
        overflowY: "auto",
        overflowX: "hidden",
        minWidth: "200px",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        ...style,
      }}
    >
      {links.map((linkGroup) => {
        const { title, links } = linkGroup;
        return (
          <div key={title}>
            <div style={{ fontWeight: "bolder", ...titleStyle }}>{title}</div>
            {links.map((link) => {
              const { label, pathname } = link;

              return (
                <div key={link.label}>
                  <StyledLink label={label} path={path} pathname={pathname} style={linkStyle} />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
