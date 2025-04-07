import { useUITheme } from "./UIThemes";
import { Sun, Moon } from "@packages/icons";
import { hexToRgba } from "@packages/css-utils";
import { ReactNode } from "react";
import { usePath } from "@packages/router";

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

export const Header = () => {
  const { currentTheme, themes, setTheme } = useUITheme();
  const { moveTo } = usePath();
  const theme = themes[currentTheme];
  const isLight = currentTheme === "light";
  const rgbaBg = hexToRgba({ hex: theme.background, opacity: 0.8 });

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
        borderBottom: `1px solid var(--theme-color)`,
        backgroundColor: rgbaBg,
        transition: "var(--theme-transition)",
      }}
    >
      <h1
        style={{
          color: "var(--theme-color)",
          transition: "var(--theme-transition)",
          cursor: "pointer",
        }}
        onClick={() => moveTo({ pathname: "/" })}
      >
        JS to YAML
      </h1>
      <button
        style={{ width: "30px", height: "30px" }}
        onClick={() => setTheme(isLight ? "dark" : "light")}
      >
        {isLight ? <Sun /> : <Moon />}
      </button>
    </div>
  );
};
