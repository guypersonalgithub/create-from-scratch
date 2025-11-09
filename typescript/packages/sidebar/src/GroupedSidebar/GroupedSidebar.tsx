import { type GroupedSidebarProps } from "./types";
import { GroupedSidebarContent } from "./GroupedSidebarContent";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { dynatic } from "@packages/dynatic-css";

export const GroupedSidebar = ({
  links,
  className,
  style,
  titleClassName,
  titleStyle,
  linkClassName,
  linkStyle,
  linkContent,
  onLinkClick,
}: GroupedSidebarProps) => {
  return (
    <div
      className={combineStringsWithSpaces(
        dynatic`
          overflow-y: auto;
          overflow-x: hidden;
          min-width: 200px;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        `,
        className,
      )}
      style={style}
    >
      <GroupedSidebarContent
        links={links}
        titleClassName={titleClassName}
        titleStyle={titleStyle}
        linkStyle={linkStyle}
        linkClassName={linkClassName}
        linkContent={linkContent}
        onLinkClick={onLinkClick}
      />
    </div>
  );
};
