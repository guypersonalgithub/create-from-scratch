import { Sun, Moon } from "@packages/icons";
import { usePath } from "@packages/router";
import { AnimationContainerWrapper } from "@packages/animation-container";
import { Button } from "@packages/button";
import { useBreakpoints } from "../breakpoints";
import { HeaderLogo } from "../customizedComponents";
import { PageSearchModal } from "../customizedComponents/PageSearchModal";
import { HeaderLinks } from "./HeaderLinks";
import { MobileSections } from "./MobileSections";
import { MobileDocumentationSidebar } from "./DocumentationSidebar";
import { dynatic } from "../dynatic-css.config";
import { useState } from "react";

export const Header = () => {
  const { moveTo } = usePath();
  const { useGetBreakpoint } = useBreakpoints();
  const { breakpoint } = useGetBreakpoint({
    updateOn: ["mediumDesktop"],
    includeMismatchBelow: true,
    defaultAboveBreakpoint: "mediumDesktop",
  });
  const isDesktop = breakpoint === "mediumDesktop";

  return (
    <div
      className={dynatic`
        position: sticky;
        top: 0;
        z-index: 100;
        height: 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 10px;
        padding-right: 10px;
        transition: ${(config) => config.shared.defaultTransition};
        border-bottom: 1px solid ${(config) => config.colors.headerBorder};
        background-color: ${(config) => config.colors.headerBG};
      `}
    >
      <div
        className={dynatic`
          display: flex;
          align-items: center;
          gap: 10px;
          color: ${(config) => config.colors.mainColor};
          transition: ${(config) => config.shared.defaultTransition};
        `}
      >
        {!isDesktop ? (
          <MobileDocumentationSidebar
            burgerClassName={dynatic`
              width: 30px;
              height: 24px;
            `}
            burgerLineClassName={dynatic`
              height: 4px;
              backgroundColor: ${(config) => config.colors.mainColor};
            `}
            onLinkClick={({ pathname }) => moveTo({ pathname })}
            className={dynatic`
              background-color: ${(config) => config.colors.mainBG};
              color: ${(config) => config.colors.mainBG};
              transition: ${(config) => config.shared.defaultTransition};
              height: 100%;
              width: 100%;
            `}
            contentContainerClassName={dynatic`
              padding-top: 10px;  
            `}
            linkClassName={dynatic`
              transition: ${(config) => config.shared.defaultTransition};
            `}
          />
        ) : null}
        <div
          className={dynatic`
            display: flex;
            gap: 10px;
            align-items: center;
            cursor: pointer;
          `}
          onClick={() => moveTo({ pathname: "/" })}
        >
          <div
            className={dynatic`
              height: 40px;
              width: 50px;
              color: ${(config) => config.colors.thirdColor};
            `}
          >
            <HeaderLogo />
          </div>
          {isDesktop ? (
            <div
              className={dynatic`
                font-size: 50px;
                font-weight: bolder;
                white-space: nowrap;
              `}
            >
              JS to YAML
            </div>
          ) : null}
        </div>
        {isDesktop ? (
          <HeaderLinks
            selectedCondition={({ path, pathname }) => {
              if (path === "/" || pathname === "/") {
                return path === pathname;
              }

              return path.startsWith(pathname);
            }}
          />
        ) : null}
      </div>
      <div
        className={dynatic`
          display: flex;
          gap: 10px;
          align-items: center;
        `}
      >
        {!isDesktop ? <MobileSections /> : null}
        <PageSearchModal
          buttonClassName={dynatic`
            background-color: ${(config) => config.colors.secondaryBG};
            transition: ${(config) => config.shared.defaultTransition};
            border: 1px solid ${(config) => config.colors.defaultBorder};
          `}
          badgeClassName={dynatic`
            background-color: ${(config) => config.colors.searchModalBadgeBackground};
            transition: ${(config) => config.shared.defaultTransition};
          `}
          modalClassName={dynatic`
            background-color: ${(config) => config.colors.searchModalBackground};
            color: ${(config) => config.colors.mainColor};
            transition: ${(config) => config.shared.defaultTransition};
          `}
          optionClassName={dynatic`
            background-color: ${(config) => config.colors.secondaryBG};  
          `}
          highlightedOptionClassName={dynatic`
            background-color: ${(config) => config.shared.lightBlue};
            color: ${(config) => config.colors.mainBG};
          `}
          footerClassName={dynatic`
            border-top: 3px solid ${(config) => config.colors.defaultBorder};  
          `}
          minimizedClassName={dynatic`
            color: ${(config) => config.colors.mainColor};
            transition: ${(config) => config.shared.defaultTransition};
          `}
          isMinimized={isDesktop}
        />
        <AnimatedThemeSwitcher />
      </div>
    </div>
  );
};

const AnimatedThemeSwitcher = () => {
  const [currentTheme, setCurrentTheme] = useState(() => document.body.classList[0]);
  const isLight = currentTheme === "light";

  const updateTheme = () => {
    setCurrentTheme((prev) => {
      const nextTheme = prev === "light" ? "dark" : "light";
      if (nextTheme === "dark") {
        document.body.classList.remove("light");
        document.body.classList.add("dark");
      } else {
        document.body.classList.add("light");
        document.body.classList.remove("dark");
      }

      return nextTheme;
    });
  };

  return (
    <Button
      className={dynatic`
        width: 30px;
        height: 30px;
        background: none;
        border: none;
        cursor: pointer;
        border-radius: 10px;
        overflow: hidden;
        transition: ${(config) => config.shared.defaultTransition};

        &:hover {
          background-color: ${(config) => config.colors.secondaryBG};
        }
      `}
      onClick={updateTheme}
    >
      <AnimationContainerWrapper
        changeMethod="fullPhase"
        onMount={[{ transform: "translateX(-100%)" }, { transform: "translateX(0%)" }]}
        onUnmount={[{ transform: "translateX(0%)" }, { transform: "translateX(100%)" }]}
      >
        {isLight ? (
          <Sun
            key="sun"
            className={dynatic`
              color: ${(config) => config.shared.lightYellow};
            `}
          />
        ) : (
          <Moon
            key="moon"
            className={dynatic`
              color: ${(config) => config.shared.whitesmoke};
            `}
          />
        )}
      </AnimationContainerWrapper>
    </Button>
  );
};
