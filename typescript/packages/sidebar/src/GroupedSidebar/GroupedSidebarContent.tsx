import { Button } from "@packages/button";
import { GroupedSidebarProps } from "./types";

export const GroupedSidebarContent = ({
  links,
  titleStyle,
  linkStyle,
  linkContent,
  onLinkClick,
}: Omit<GroupedSidebarProps, "style">) => {
  return links.map((linkGroup) => {
    const { title, links } = linkGroup;
    return (
      <div key={title}>
        <div style={{ fontWeight: "bolder", ...titleStyle }}>{title}</div>
        {links.map((link) => {
          const { label, pathname } = link;

          return (
            <div key={label}>
              {linkContent?.({ label, pathname, onLinkClick }) || (
                <Button
                  style={linkStyle?.({ pathname })}
                  onClick={() => onLinkClick?.({ pathname })}
                >
                  {label}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    );
  });
};
