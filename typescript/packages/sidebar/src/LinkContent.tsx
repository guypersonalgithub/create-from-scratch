import { Button } from "@packages/button";
import { Tooltip } from "@packages/tooltip";
import { SidebarLink } from "./types";
import { CSSProperties } from "react";

type LinkContentProps = {
  link: SidebarLink;
  isOpen?: boolean;
  onLinkClick: ({ pathname, queryParams }: Pick<SidebarLink, "pathname" | "queryParams">) => void;
  openedWidth?: number;
  iconSize?: number;
  selected?: string;
  selectedStyle?: CSSProperties;
  tooltipDistanceFromViewport?: number;
  linkStyle?: CSSProperties;
  disabledTooltip?: boolean;
};

export const LinkContent = ({
  link,
  isOpen,
  onLinkClick,
  openedWidth,
  iconSize,
  selected,
  selectedStyle,
  tooltipDistanceFromViewport,
  linkStyle,
  disabledTooltip
}: LinkContentProps) => {
  return (
    <Tooltip
      content={link.label}
      style={{
        overflow: "hidden",
        transition: "width 0.3s ease",
        width: isOpen ? "100%" : `${iconSize ? iconSize + 6 : undefined}px`,
      }}
      disabled={disabledTooltip || isOpen}
      side="right"
      offset={{
        y: iconSize ? iconSize / 2 : undefined,
      }}
      distanceFromViewport={tooltipDistanceFromViewport}
    >
      <Button
        key={link.label}
        style={{
          display: "flex",
          gap: "20px",
          cursor: "pointer",
          border: "none",
          background: "none",
          color: "white",
          borderRadius: "10px",
          fontSize: "16px",
          alignItems: "center",
          overflow: "hidden",
          width: "100%",
          padding: 0,
          paddingTop: "2px",
          backgroundColor: "inherit",
          ...linkStyle,
          ...(selected === link.pathname ? selectedStyle : {}),
        }}
        onClick={() => onLinkClick({ pathname: link.pathname, queryParams: link.queryParams })}
      >
        <div
          style={{
            width: `${iconSize}px`,
            minWidth: `${iconSize}px`,
            height: `${iconSize}px`,
            transition: "transform 0.3s ease",
            transform: `translateX(${isOpen ? 10 : 3}px)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {link.icon}
        </div>
        <div style={{ width: "100%", overflow: "hidden", textAlign: "left" }}>
          <div
            style={{
              transition: "transform 0.3s ease",
              transform: `translateX(${isOpen ? 0 : openedWidth}px)`,
              fontWeight: "bold",
            }}
          >
            {link.label}
          </div>
        </div>
      </Button>
    </Tooltip>
  );
};
