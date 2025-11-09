import { Button } from "@packages/button";
import { type GroupedSidebarProps } from "./types";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { dynatic } from "@packages/dynatic-css";

export const GroupedSidebarContent = ({
  links,
  titleClassName,
  titleStyle,
  linkClassName,
  linkStyle,
  linkContent,
  onLinkClick,
}: Omit<GroupedSidebarProps, "className" | "style">) => {
  return links.map((linkGroup) => {
    const { title, links } = linkGroup;

    return (
      <div key={title}>
        <div
          className={combineStringsWithSpaces(
            dynatic`
              font-weight: bolder;
            `,
            titleClassName,
          )}
          style={titleStyle}
        >
          {title}
        </div>
        {links.map((link) => {
          const { label, pathname } = link;

          return (
            <div key={label}>
              {linkContent?.({ label, pathname, onLinkClick }) || (
                <Button
                  className={linkClassName?.({ pathname })}
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
