import { CSSProperties, ReactNode, useRef, useState } from "react";
import { SidebarLink } from "./types";
import { AnimationContainerWrapper } from "@packages/animation-container";
import { Button } from "@packages/button";
import { DoubleArrowRightFull } from "@packages/icons";
import { Tooltip } from "@packages/tooltip";

type MinimizableSidebarProps = {
  title: ReactNode;
  links: SidebarLink[];
  onLinkClick: ({ pathname, queryParams }: Pick<SidebarLink, "pathname" | "queryParams">) => void;
  openedWidth: number;
  closedWidth: number;
  isOpenInitially?: boolean;
  iconSize?: number;
  selected?: string;
  selectedStyle?: CSSProperties;
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
}: MinimizableSidebarProps) => {
  const disableAnimation = useRef(true);
  const [isOpen, setIsOpen] = useState(isOpenInitially);
  const animationStarted = useRef(false);

  return (
    <AnimationContainerWrapper
      changeMethod="fullPhase"
      animation={
        isOpen
          ? [{ width: `${closedWidth}px` }, { width: `${openedWidth}px` }]
          : [{ width: `${openedWidth}px` }, { width: `${closedWidth}px` }]
      }
      animationOptions={{ duration: 300, easing: "ease-out" }}
      style={{
        height: "100%",
        width: `${openedWidth}px`,
        backgroundColor: "#1f1616",
        boxSizing: "border-box",
        borderRadius: "20px",
      }}
      disableAnimation={disableAnimation.current}
      disableLifeCycleAnimations
      onAnimationStart={() => {
        animationStarted.current = true;
      }}
      onAnimationEnd={() => {
        animationStarted.current = false;
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

              setIsOpen((prev) => !prev);
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
          <LinksContent
            links={links}
            isOpen={isOpen}
            iconSize={iconSize}
            openedWidth={openedWidth}
            onLinkClick={onLinkClick}
            selected={selected}
            selectedStyle={selectedStyle}
          />
        </div>
      </div>
    </AnimationContainerWrapper>
  );
};

type LinksContentProps = Pick<
  MinimizableSidebarProps,
  "links" | "iconSize" | "openedWidth" | "onLinkClick" | "selected" | "selectedStyle"
> & {
  isOpen: boolean;
};

const LinksContent = ({
  links,
  isOpen,
  iconSize,
  openedWidth,
  onLinkClick,
  selected,
  selectedStyle,
}: LinksContentProps) => {
  return links.map((link) => {
    return (
      <Tooltip
        key={link.label}
        content={link.label}
        style={{
          overflow: "hidden",
          transition: "width 0.3s ease",
          width: isOpen ? "100%" : `${iconSize ? iconSize + 6 : undefined}px`,
        }}
        disabled={isOpen}
        side="right"
        offset={{
          y: iconSize ? iconSize / 2 : undefined,
        }}
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
  });
};
