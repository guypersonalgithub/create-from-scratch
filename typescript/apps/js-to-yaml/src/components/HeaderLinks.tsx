import { usePathState } from "@packages/router";
import { StyledLink } from "../styledComponents/StyledLink";
import { type CSSProperties } from "react";
import { useBreakpoints } from "../breakpoints";
import { useUITheme } from "../UIThemes";
import { hexToRgba } from "@packages/css-utils";

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
  style?: CSSProperties;
  selectedCondition?: (args: { path: string; pathname: string }) => boolean;
};

export const HeaderLinks = ({ style, selectedCondition }: HeaderLinksProps) => {
  const { path } = usePathState();

  return headerLinks.map((headerLink) => {
    const { label, pathname } = headerLink;

    return (
      <StyledLink
        key={label}
        path={path}
        pathname={pathname}
        label={label}
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
      style={{
        position: "sticky",
        bottom: 0,
        zIndex: 100,
        height: "60px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: "10px",
        paddingRight: "10px",
        borderTop: `1px solid ${borderBottomColor}`,
        backgroundColor: rgbaBg,
        transition: "var(--theme-transition)",
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
      style={isTablet ? { fontWeight: "normal", fontSize: "12px" } : undefined}
      selectedCondition={({ path, pathname }) => {
        if (path === "/" || pathname === "/") {
          return path === pathname;
        }

        return path.startsWith(pathname);
      }}
    />
  );
};
