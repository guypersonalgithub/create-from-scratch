import { type CSSProperties, type ReactNode, useRef, useState } from "react";
import { type SidebarLink, type SidebarLinkGroup } from "./types";
import { useAnimation } from "@packages/animation-container";
import { Button } from "@packages/button";
import { DoubleArrowRightFull } from "@packages/icons";
import { LinkContent } from "./LinkContent";
import { isLinkGroup } from "./utils";
import { LinkGroup } from "./LinkGroup";

type MinimizableSidebarProps = {
  title: ReactNode;
  links: (SidebarLink | SidebarLinkGroup)[];
  onLinkClick: ({ pathname, queryParams }: Pick<SidebarLink, "pathname" | "queryParams">) => void;
  openedWidth: number;
  closedWidth: number;
  isOpenInitially?: boolean;
  iconSize?: number;
  selected?: string;
  selectedStyle?: CSSProperties;
  containerStyle?: CSSProperties;
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
  selectedStyle = {},
  containerStyle = {},
}: MinimizableSidebarProps) => {
  const disableAnimation = useRef(true);
  const [isOpen, setIsOpen] = useState(isOpenInitially);
  const animationStarted = useRef(false);
  const { animate } = useAnimation();
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      style={{
        height: "100%",
        width: `${openedWidth}px`,
        backgroundColor: "#1f1616",
        boxSizing: "border-box",
        borderRadius: "20px",
        ...containerStyle,
      }}
    >
      <div
        key="sidebar"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "5px",
        }}
      >
        <div
          style={{ overflow: "hidden", width: "100%", display: "flex", justifyContent: "center" }}
        >
          {title}
        </div>
        <div style={{ display: "flex", justifyContent: "end", width: "100%" }}>
          <Button
            style={{
              cursor: "pointer",
              border: "none",
              background: "default",
              backgroundColor: "black",
              color: "white",
              borderRadius: "10px",
              fontSize: "16px",
              width: "30px",
              height: "30px",
            }}
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
              style={{
                transition: "transform 0.3s ease",
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                display: "flex",
                justifyItems: "center",
                justifyContent: "center",
              }}
            >
              <DoubleArrowRightFull />
            </div>
          </Button>
        </div>
        <div
          style={{
            marginTop: "10px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
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
                  selectedStyle={selectedStyle}
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
                selectedStyle={selectedStyle}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
