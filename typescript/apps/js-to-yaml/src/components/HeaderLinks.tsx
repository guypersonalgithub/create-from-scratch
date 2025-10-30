import { usePathState } from "@packages/router";
import { StyledLink } from "../customizedComponents/StyledLink";
import { type CSSProperties } from "react";
import { useBreakpoints } from "../breakpoints";
import { useUITheme } from "../UIThemes";
import { hexToRgba } from "@packages/css-utils";
import { dynatic } from "../dynatic-css.config";

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

type HeaderLinksProps = {
  className?: string;
  style?: CSSProperties;
  selectedCondition?: (args: { path: string; pathname: string }) => boolean;
};

export const HeaderLinks = ({ className, style, selectedCondition }: HeaderLinksProps) => {
  const { path } = usePathState();

  return headerLinks.map((headerLink) => {
    const { label, pathname } = headerLink;

    return (
      <StyledLink
        key={label}
        path={path}
        pathname={pathname}
        label={label}
        className={className}
        style={style}
        selectedCondition={selectedCondition}
      />
    );
  });
};

export const MobileFooter = () => {
  const { currentTheme, themes } = useUITheme();
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

  if (isDesktop) {
    return null;
  }

  return (
    <div
      key="mobileFooter"
      className={dynatic`
        position: sticky;
        bottom: 0;
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
        borderTop: `1px solid ${borderBottomColor}`,
        backgroundColor: rgbaBg,
      }}
    >
      <MobileFooterLinks />
    </div>
  );
};

const MobileFooterLinks = () => {
  const { useGetBreakpoint } = useBreakpoints();
  const { breakpoint } = useGetBreakpoint({
    updateOn: ["mobile"],
    includeMismatchAbove: true,
    defaultBelowBreakpoint: "mobile",
  });
  const isTablet = breakpoint === "mobile";

  return (
    <HeaderLinks
      className={
        isTablet
          ? dynatic`
              font-weight: normal;
              font-size: 12px;
            `
          : undefined
      }
      selectedCondition={({ path, pathname }) => {
        if (path === "/" || pathname === "/") {
          return path === pathname;
        }

        return path.startsWith(pathname);
      }}
    />
  );
};
