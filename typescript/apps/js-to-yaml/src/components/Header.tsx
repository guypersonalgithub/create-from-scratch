import { useUITheme } from "../UIThemes";
import { Sun, Moon } from "@packages/icons";
import { hexToRgba } from "@packages/css-utils";
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

export const Header = () => {
  const { currentTheme, themes, setTheme } = useUITheme();
  const { moveTo } = usePath();
  const theme = themes[currentTheme];
  const isLight = currentTheme === "light";
  const rgbaBg = hexToRgba({ hex: theme.background, opacity: 0.8 });
  const borderBottomColor = isLight ? "rgb(226, 232, 240)" : "rgb(30, 41, 59)";
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
      `}
      style={{
        borderBottom: `1px solid ${borderBottomColor}`,
        backgroundColor: rgbaBg,
      }}
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
            burgerStyle={{ width: "30px", height: "24px" }}
            burgerLineStyle={{ height: "4px", backgroundColor: "var(--theme-color" }}
            onLinkClick={({ pathname }) => moveTo({ pathname })}
            style={{
              backgroundColor: "var(--theme-background)",
              color: "var(--theme-color)",
              transition: "var(--theme-transition)",
              height: "100%",
              width: "100%",
            }}
            contentContainerStyle={{ paddingTop: "10px" }}
            linkStyle={{ transition: "var(--theme-transition)" }}
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
          buttonStyle={{
            backgroundColor: "var(--theme-subBackground)",
            transition: "var(--theme-transition)",
            border: "1px solid var(--theme-border)",
          }}
          badgeStyle={{
            backgroundColor: !isLight ? "var(--theme-background)" : "#eee9f6",
            transition: "var(--theme-transition)",
          }}
          modalStyle={{
            backgroundColor: isLight ? "var(--theme-background)" : "rgb(20, 20, 20)",
            color: "var(--theme-color)",
            transition: "var(--theme-transition)",
          }}
          optionStyle={{
            backgroundColor: "var(--theme-subBackground)",
          }}
          highlightedOptionStyle={{
            backgroundColor: "rgba(0, 119, 184, 0.976)",
            color: "var(--theme-background)",
          }}
          footerStyle={{ borderTop: "3px solid var(--theme-border)" }}
          mobileButtonStyle={{
            transition: "var(--theme-transition)",
            color: "var(--theme-color)",
          }}
          isDesktop={isDesktop}
        />
        <Button
          style={{
            width: "30px",
            height: "30px",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            borderRadius: "10px",
            overflow: "hidden",
            transition: "background 0.5s ease",
          }}
          onClick={() => setTheme(isLight ? "dark" : "light")}
          onHoverCSS={() => ({ backgroundColor: "var(--theme-subBackground)" })}
        >
          <AnimationContainerWrapper
            changeMethod="fullPhase"
            onMount={[{ transform: "translateX(-100%)" }, { transform: "translateX(0%)" }]}
            onUnmount={[{ transform: "translateX(0%)" }, { transform: "translateX(100%)" }]}
          >
            {isLight ? (
              <Sun key="sun" style={{ color: "#FFD54F" }} />
            ) : (
              <Moon key="moon" style={{ color: "whitesmoke" }} />
            )}
          </AnimationContainerWrapper>
        </Button>
      </div>
    </div>
  );
};
