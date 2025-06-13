import { type CSSProperties, Fragment, useState } from "react";
import { AnimationContainerWrapper } from "@packages/animation-container";
import { AnimatedBurgerIcon } from "../AnimatedBurgerIcon";
import { type GroupedSidebarProps } from "./types";
import { GroupedSidebarContent } from "./GroupedSidebarContent";

export type MobileGroupedSidebarProps = GroupedSidebarProps & {
  burgerStyle?: CSSProperties;
  burgerLineStyle?: CSSProperties;
  contentContainerStyle?: CSSProperties;
  closeOnLinkClick?: boolean;
};

export const MobileGroupedSidebar = ({
  burgerStyle,
  burgerLineStyle,
  links,
  onLinkClick,
  style,
  contentContainerStyle,
  closeOnLinkClick,
  titleStyle,
  linkStyle,
  linkContent,
}: MobileGroupedSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const completeLinkClick = ({ pathname }: { pathname: string }) => {
    onLinkClick?.({ pathname });
    if (closeOnLinkClick) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <AnimatedBurgerIcon
        style={burgerStyle}
        burgerLineStyle={burgerLineStyle}
        isOpen={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      />
      <AnimationContainerWrapper
        onMount={[{ transform: "translateX(-100%)" }, { transform: "translateX(0%)" }]}
        changeMethod="gradual"
        style={{
          position: "absolute",
          left: "0px",
          right: "0px",
          top: "100%",
          height: "100vh",
          pointerEvents: "none",
        }}
        styleOnceAnimating={{ transform: "translateX(-100%)" }}
        disableMountAnimationOnInit={false}
      >
        {isOpen ? (
          <div key="opened" style={style}>
            <div
              style={{
                marginTop: "1px",
                pointerEvents: "all",
                overflowY: "auto",
                overflowX: "hidden",
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                width: "fit-content",
                margin: "0 auto",
                ...contentContainerStyle,
              }}
            >
              <GroupedSidebarContent
                links={links}
                titleStyle={titleStyle}
                linkStyle={linkStyle}
                linkContent={linkContent}
                onLinkClick={completeLinkClick}
              />
            </div>
          </div>
        ) : (
          <Fragment key="closed" />
        )}
      </AnimationContainerWrapper>
    </>
  );
};
