import { Button } from "@packages/button";
import { Tooltip } from "@packages/tooltip";
import { type SidebarLink } from "./types";
import { type CSSProperties } from "react";
import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";

type LinkContentProps = {
  link: SidebarLink;
  isOpen?: boolean;
  onLinkClick: ({ pathname, queryParams }: Pick<SidebarLink, "pathname" | "queryParams">) => void;
  openedWidth?: number;
  iconSize?: number;
  selected?: string;
  selectedClassName?: string;
  selectedStyle?: CSSProperties;
  tooltipDistanceFromViewport?: number;
  linkClassName?: string;
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
  selectedClassName,
  selectedStyle,
  tooltipDistanceFromViewport,
  linkClassName,
  linkStyle,
  disabledTooltip,
}: LinkContentProps) => {
  return (
    <Tooltip
      content={link.label}
      className={combineStringsWithSpaces(
        dynatic`
          overflow: hidden;
          transition: width 0.3s ease;  
        `,
        isOpen
          ? dynatic`
              width: 100%;
            `
          : iconSize
            ? dynatic`
                width: ${iconSize + 6}px;
              `
            : undefined,
      )}
      disabled={disabledTooltip || isOpen}
      side="right"
      offset={{
        y: iconSize ? iconSize / 2 : undefined,
      }}
      distanceFromViewport={tooltipDistanceFromViewport}
    >
      <Button
        key={link.label}
        className={combineStringsWithSpaces(
          dynatic`
            display: flex;
            gap: 20px;
            cursor: pointer;
            border: none;
            background: none;
            color: white;
            border-radius: 10px;
            font-size: 16px;
            align-items: center;
            overflow: hidden;
            width: 100%;
            padding: 0;
            padding-top: 2px;
            background-color: inherit;
          `,
          linkClassName,
          selected === link.pathname && selectedClassName,
        )}
        style={{
          ...linkStyle,
          ...(selected === link.pathname ? selectedStyle : {}),
        }}
        onClick={() => onLinkClick({ pathname: link.pathname, queryParams: link.queryParams })}
      >
        <div
          className={combineStringsWithSpaces(
            dynatic`
              transition: transform 0.3s ease;
              display: flex;
              align-items: center;
              justify-content: center;
            `,
            iconSize &&
              dynatic`
              width: ${iconSize}px;
              min-width: ${iconSize}px;
              height: ${iconSize}px;
            `,
            isOpen
              ? dynatic`
                  transform: translateX(10px);
                `
              : dynatic`
                  transform: translateX(3px);
                `,
          )}
        >
          {link.icon}
        </div>
        <div
          className={dynatic`
            width: 100%;
            overflow: hidden;
            text-align: left;
          `}
        >
          <div
            className={combineStringsWithSpaces(
              dynatic`
                transition: transform 0.3s ease;
                font-weight: bold;
              `,
              isOpen
                ? dynatic`
                    transform: translateX(0);
                  `
                : openedWidth &&
                    dynatic`
                      transform: translateX(${openedWidth}px);
                    `,
            )}
          >
            {link.label}
          </div>
        </div>
      </Button>
    </Tooltip>
  );
};
