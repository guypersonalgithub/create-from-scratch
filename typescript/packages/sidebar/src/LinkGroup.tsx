import { Collapsible } from "@packages/collapsible";
import { SidebarLink, SidebarLinkGroup } from "./types";
import { LinkContent } from "./LinkContent";
import { CSSProperties } from "react";
import { isLinkGroup } from "./utils";

type LinkGroupProps = SidebarLinkGroup & {
  isOpen: boolean;
  onLinkClick: ({ pathname, queryParams }: Pick<SidebarLink, "pathname" | "queryParams">) => void;
  openedWidth: number;
  iconSize?: number;
  selected?: string;
  selectedStyle?: CSSProperties;
};

export const LinkGroup = ({
  category,
  links,
  isOpen,
  onLinkClick,
  openedWidth,
  iconSize,
  selected,
  selectedStyle,
}: LinkGroupProps) => {
  return (
    <Collapsible title={category} containerStyle={{ width: "100%" }}>
      {links.map((link, index) => {
        if (isLinkGroup(link)) {
          return (
            <LinkGroup
              key={`${link.category}-${index}`}
              isOpen={isOpen}
              iconSize={iconSize}
              openedWidth={openedWidth}
              onLinkClick={onLinkClick}
              selected={selected}
              selectedStyle={selectedStyle}
              {...link}
            />
          );
        }

        return (
          <LinkContent
            key={`${link.label}-${index}`}
            link={link}
            isOpen={isOpen}
            iconSize={iconSize}
            openedWidth={openedWidth}
            onLinkClick={onLinkClick}
            selected={selected}
            selectedStyle={selectedStyle}
          />
        );
      })}
    </Collapsible>
  );
};
