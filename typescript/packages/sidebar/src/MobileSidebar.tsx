import { CSSProperties, Fragment, useState } from "react";
import { SidebarLink, SidebarLinkGroup } from "./types";
import { AnimationContainerWrapper } from "@packages/animation-container";
import { isLinkGroup } from "./utils";
import { LinkGroup } from "./LinkGroup";
import { LinkContent } from "./LinkContent";
import { AnimatedBurgerIcon } from "./AnimatedBurgerIcon";

type MobileSidebarProps = {
  burgerStyle?: CSSProperties;
  burgerLineStyle?: CSSProperties;
  links: (SidebarLink | SidebarLinkGroup)[];
  onLinkClick: ({ pathname, queryParams }: Pick<SidebarLink, "pathname" | "queryParams">) => void;
  selected?: string;
  selectedStyle?: CSSProperties;
  containerStyle?: CSSProperties;
  subContainerStyle?: CSSProperties;
  linkStyle?: CSSProperties;
  disabledTooltip?: boolean;
  closeOnLinkClick?: boolean;
};

export const MobileSidebar = ({
  burgerStyle,
  burgerLineStyle,
  links,
  onLinkClick,
  selected,
  selectedStyle,
  containerStyle,
  subContainerStyle,
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
          <div key="opened" style={containerStyle}>
            <div
              style={{
                marginTop: "1px",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                pointerEvents: "all",
                ...subContainerStyle,
              }}
            >
              {links.map((link) => {
                if (isLinkGroup(link)) {
                  return (
                    <LinkGroup
                      key={link.category}
                      onLinkClick={completeLinkClick}
                      selected={selected}
                      selectedStyle={selectedStyle}
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
                    selectedStyle={selectedStyle}
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
