import { type CSSProperties, type ReactNode, useRef, useState } from "react";
import { type SidebarLink, type SidebarLinkGroup } from "./types";
import { useAnimation } from "@packages/animation-container";
import { Button } from "@packages/button";
import { DoubleArrowRightFull } from "@packages/icons";
import { LinkContent } from "./LinkContent";
import { isLinkGroup } from "./utils";
import { LinkGroup } from "./LinkGroup";
import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";

type MinimizableSidebarProps = {
  title: ReactNode;
  links: (SidebarLink | SidebarLinkGroup)[];
  onLinkClick: ({ pathname, queryParams }: Pick<SidebarLink, "pathname" | "queryParams">) => void;
  openedWidth: number;
  closedWidth: number;
  isOpenInitially?: boolean;
  iconSize?: number;
  selected?: string;
  selectedClassName?: string;
  selectedStyle?: CSSProperties;
  containerClassName?: string;
  containerStyle?: CSSProperties;
  linkClassName?: string;
  linkStyle?: CSSProperties;
};

export const MinimizableSidebar = ({
  title,
  links,
  onLinkClick,
  openedWidth,
  closedWidth,
  isOpenInitially = true,
  iconSize,
  selected,
  selectedClassName,
  selectedStyle,
  containerClassName,
  containerStyle,
  linkClassName,
  linkStyle,
}: MinimizableSidebarProps) => {
  const disableAnimation = useRef(true);
  const [isOpen, setIsOpen] = useState(isOpenInitially);
  const animationStarted = useRef(false);
  const { animate } = useAnimation();
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={combineStringsWithSpaces(
        dynatic`
          height: 100%;
          width: ${openedWidth}px;
          background-color: #1f1616;
          box-sizing: border-box;
          border-radius: 20px;
        `,
        containerClassName,
      )}
      style={containerStyle}
    >
      <div
        key="sidebar"
        className={dynatic`
          display: flex;  
          flex-direction: column;
          align-items: center;
          padding: 5px;
        `}
      >
        <div
          className={dynatic`
            overflow: hidden;
            width: 100%;
            display: flex;
            justify-content: center;
          `}
        >
          {title}
        </div>
        <div
          className={dynatic`
            display: flex;
            justify-content: end;
            width: 100%;
          `}
        >
          <Button
            className={dynatic`
              cursor: pointer;
              border: none;
              background: default;
              background-color: black;
              color: white;
              border-radius: 10px;
              font-size: 16px;
              width: 30px;
              height: 30px;
            `}
            onClick={() => {
              if (animationStarted.current) {
                return;
              }

              setIsOpen((prev) => {
                const isOpen = !prev;

                if (ref.current) {
                  const animation = isOpen
                    ? [{ width: `${closedWidth}px` }, { width: `${openedWidth}px` }]
                    : [{ width: `${openedWidth}px` }, { width: `${closedWidth}px` }];
                  const animationOptions = { duration: 300, easing: "ease-out" };
                  const onAnimationStart = () => {
                    animationStarted.current = true;
                  };
                  const onAnimationEnd = () => {
                    animationStarted.current = false;
                  };

                  const {} = animate({
                    element: ref.current,
                    animation,
                    animationOptions,
                    onAnimationStart,
                    onAnimationEnd,
                  });
                }

                return isOpen;
              });
              disableAnimation.current = false;
            }}
          >
            <div
              className={combineStringsWithSpaces(
                dynatic`
                transition: transform 0.3s ease;
                display: flex;
                justify-items: center;
                justify-content: center;
              `,
                isOpen
                  ? dynatic`
                      transform: rotate(180deg);
                    `
                  : dynatic`
                      transform: rotate(0deg);
                    `,
              )}
            >
              <DoubleArrowRightFull />
            </div>
          </Button>
        </div>
        <div
          className={dynatic`
            margin-top: 10px;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
          `}
        >
          {links.map((link) => {
            if (isLinkGroup(link)) {
              return (
                <LinkGroup
                  key={link.category}
                  isOpen={isOpen}
                  iconSize={iconSize}
                  openedWidth={openedWidth}
                  onLinkClick={onLinkClick}
                  selected={selected}
                  selectedClassName={selectedClassName}
                  selectedStyle={selectedStyle}
                  linkClassName={linkClassName}
                  linkStyle={linkStyle}
                  {...link}
                />
              );
            }

            return (
              <LinkContent
                key={link.label}
                link={link}
                isOpen={isOpen}
                iconSize={iconSize}
                openedWidth={openedWidth}
                onLinkClick={onLinkClick}
                selected={selected}
                selectedClassName={selectedClassName}
                selectedStyle={selectedStyle}
                linkClassName={linkClassName}
                linkStyle={linkStyle}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
