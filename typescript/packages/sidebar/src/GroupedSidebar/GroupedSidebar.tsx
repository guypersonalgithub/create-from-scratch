import { GroupedSidebarProps } from "./types";
import { GroupedSidebarContent } from "./GroupedSidebarContent";

export const GroupedSidebar = ({
  links,
  style,
  titleStyle,
  linkStyle,
  linkContent,
  onLinkClick,
}: GroupedSidebarProps) => {
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
      <GroupedSidebarContent
        links={links}
        titleStyle={titleStyle}
        linkStyle={linkStyle}
        linkContent={linkContent}
        onLinkClick={onLinkClick}
      />
    </div>
  );
};
