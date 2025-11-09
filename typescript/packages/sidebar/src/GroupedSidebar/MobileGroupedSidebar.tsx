import { type CSSProperties, Fragment, useState } from "react";
import { AnimationContainerWrapper } from "@packages/animation-container";
import { AnimatedBurgerIcon } from "../AnimatedBurgerIcon";
import { type GroupedSidebarProps } from "./types";
import { GroupedSidebarContent } from "./GroupedSidebarContent";
import { dynatic } from "@packages/dynatic-css";

export type MobileGroupedSidebarProps = GroupedSidebarProps & {
  burgerClassName?: string;
  burgerStyle?: CSSProperties;
  burgerLineClassName?: string;
  burgerLineStyle?: CSSProperties;
  contentContainerClassName?: string;
  contentContainerStyle?: CSSProperties;
  closeOnLinkClick?: boolean;
};

export const MobileGroupedSidebar = ({
  burgerClassName,
  burgerStyle,
  burgerLineClassName,
  burgerLineStyle,
  links,
  onLinkClick,
  className,
  style,
  contentContainerClassName,
  contentContainerStyle,
  closeOnLinkClick,
  titleClassName,
  titleStyle,
  linkClassName,
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
        className={dynatic`
          position: absolute;
          left: 0;
          right: 0;
          top: 100%;
          height: 100vh;
          point-events: none;  
        `}
        classNameOnceAnimating={dynatic`
          transform: translateX(-100%);  
        `}
        disableMountAnimationOnInit={false}
      >
        {isOpen ? (
          <div key="opened" className={className} style={style}>
            <div
              className={dynatic`
                margin-top; 1px;
                pointer-events: all;
                overflow-y: auto;
                overflow-x: hidden;
                padding: 10px;
                display: flex;
                flex-direction: column;
                gap: 20px;
                width: fit-content;
                margin: 0 auto;
              `}
              style={contentContainerStyle}
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
