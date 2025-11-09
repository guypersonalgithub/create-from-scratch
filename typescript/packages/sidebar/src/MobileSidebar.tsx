import { type CSSProperties, Fragment, useState } from "react";
import { type SidebarLink, type SidebarLinkGroup } from "./types";
import { AnimationContainerWrapper } from "@packages/animation-container";
import { isLinkGroup } from "./utils";
import { LinkGroup } from "./LinkGroup";
import { LinkContent } from "./LinkContent";
import { AnimatedBurgerIcon } from "./AnimatedBurgerIcon";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { dynatic } from "@packages/dynatic-css";

type MobileSidebarProps = {
  burgerClassName?: string;
  burgerStyle?: CSSProperties;
  burgerLineClassName?: string;
  burgerLineStyle?: CSSProperties;
  links: (SidebarLink | SidebarLinkGroup)[];
  onLinkClick: ({ pathname, queryParams }: Pick<SidebarLink, "pathname" | "queryParams">) => void;
  selected?: string;
  selectedClassName?: string;
  selectedStyle?: CSSProperties;
  containerClassName?: string;
  containerStyle?: CSSProperties;
  subContainerClassName?: string;
  subContainerStyle?: CSSProperties;
  linkClassName?: string;
  linkStyle?: CSSProperties;
  disabledTooltip?: boolean;
  closeOnLinkClick?: boolean;
};

export const MobileSidebar = ({
  burgerClassName,
  burgerStyle,
  burgerLineClassName,
  burgerLineStyle,
  links,
  onLinkClick,
  selected,
  selectedClassName,
  selectedStyle,
  containerClassName,
  containerStyle,
  subContainerClassName,
  subContainerStyle,
  linkClassName,
  linkStyle,
  disabledTooltip,
  closeOnLinkClick,
}: MobileSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const completeLinkClick = ({
    pathname,
    queryParams,
  }: Pick<SidebarLink, "pathname" | "queryParams">) => {
    onLinkClick({ pathname, queryParams });
    if (closeOnLinkClick) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <AnimatedBurgerIcon
        className={burgerClassName}
        style={burgerStyle}
        burgerLineClassName={burgerLineClassName}
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
          pointer-events: none;  
        `}
        classNameOnceAnimating={dynatic`
          transform: translateX(-100%);
        `}
        disableMountAnimationOnInit={false}
      >
        {isOpen ? (
          <div key="opened" className={containerClassName} style={containerStyle}>
            <div
              className={combineStringsWithSpaces(
                dynatic`
                  margin-top: 10px;
                  width: 100%;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  gap: 10px;
                  point-events: all;
                `,
                subContainerClassName,
              )}
              style={subContainerStyle}
            >
              {links.map((link) => {
                if (isLinkGroup(link)) {
                  return (
                    <LinkGroup
                      key={link.category}
                      onLinkClick={completeLinkClick}
                      selected={selected}
                      selectedClassName={selectedClassName}
                      selectedStyle={selectedStyle}
                      linkClassName={linkClassName}
                      linkStyle={linkStyle}
                      disabledTooltip={disabledTooltip}
                      {...link}
                    />
                  );
                }

                return (
                  <LinkContent
                    key={link.label}
                    link={link}
                    onLinkClick={completeLinkClick}
                    selected={selected}
                    selectedClassName={selectedClassName}
                    selectedStyle={selectedStyle}
                    linkClassName={linkClassName}
                    linkStyle={linkStyle}
                    disabledTooltip={disabledTooltip}
                  />
                );
              })}
            </div>
          </div>
        ) : (
          <Fragment key="closed" />
        )}
      </AnimationContainerWrapper>
    </>
  );
};
