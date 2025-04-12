import { useUITheme } from "./UIThemes";
import { Sun, Moon } from "@packages/icons";
import { hexToRgba } from "@packages/css-utils";
import { ReactNode } from "react";
import { usePath, usePathState } from "@packages/router";
import { AnimationContainerWrapper } from "@packages/animation-container";
import { Button } from "@packages/button";
import { MobileSidebar } from "@packages/sidebar";
import { useGetBreakpoint } from "./breakpoints";

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  const { currentTheme } = useUITheme();
  const isLight = currentTheme === "light";
  const { firstColor, secondColor } = isLight
    ? { firstColor: "hsl(201 100% 36% / 0.1)", secondColor: "hsl(246 100% 77% / 0.1)" }
    : { firstColor: "hsl(201 100% 36% / 0.1)", secondColor: "hsl(0 0% 0% / 1)" };

  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: `linear-gradient(135deg, ${firstColor}, ${secondColor})`,
        overflowY: "auto",
        backgroundColor: isLight ? "var(--theme-background)" : secondColor,
        transition: "var(--theme-transition)",
      }}
    >
      {children}
    </div>
  );
};

const headerLinks = [
  {
    label: "Home",
    pathname: "/",
  },
  {
    label: "Documentation",
    pathname: "/documentation",
  },
  {
    label: "Examples",
    pathname: "/examples",
  },
  {
    label: "Playground",
    pathname: "/playground",
  },
];

export const Header = () => {
  const { currentTheme, themes, setTheme } = useUITheme();
  const { moveTo } = usePath();
  const theme = themes[currentTheme];
  const isLight = currentTheme === "light";
  const rgbaBg = hexToRgba({ hex: theme.background, opacity: 0.8 });
  const borderBottomColor = isLight ? "rgb(226, 232, 240)" : "rgb(30, 41, 59)";
  const { breakpoint } = useGetBreakpoint();
  const isMobile = breakpoint === "mobile";

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        height: "60px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: "10px",
        paddingRight: "10px",
        borderBottom: `1px solid ${borderBottomColor}`,
        backgroundColor: rgbaBg,
        transition: "var(--theme-transition)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          color: "var(--theme-color)",
          transition: "var(--theme-transition)",
        }}
      >
        {isMobile ? (
          <MobileSidebar
            burgerStyle={{ width: "30px", height: "24px" }}
            burgerLineStyle={{ height: "4px", backgroundColor: "var(--theme-color" }}
            links={headerLinks}
            onLinkClick={({ pathname, queryParams }) => moveTo({ pathname, queryParams })}
            containerStyle={{
              backgroundColor: "var(--theme-background)",
              color: "var(--theme-color)",
              transition: "var(--theme-transition)",
              height: "100%",
              width: "100%"
            }}
            subContainerStyle={{ paddingTop: "10px" }}
            linkStyle={{ color: "var(--theme-color)", transition: "var(--theme-transition)" }}
            disabledTooltip
            closeOnLinkClick
          />
        ) : null}
        <h1 style={{ cursor: "pointer" }} onClick={() => moveTo({ pathname: "/" })}>
          JS to YAML
        </h1>
        {!isMobile ? <HeaderLinks /> : null}
      </div>
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
  );
};

const HeaderLinks = () => {
  const { moveTo } = usePath();
  const { path } = usePathState();

  return headerLinks.map((headerLink) => {
    const { label, pathname } = headerLink;

    return (
      <div
        key={pathname}
        className="headerLink"
        style={{
          cursor: "pointer",
          transition: "color 0.5s ease",
          fontWeight: "bold",
          color: pathname === path ? "rgb(25, 187, 187)" : undefined,
        }}
        onClick={() => moveTo({ pathname })}
      >
        {label}
      </div>
    );
  });
};
