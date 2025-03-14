import { useUITheme } from "./UIThemes";
import { Sun, Moon } from "@packages/icons";

export const Header = () => {
  const { currentTheme, themes, setTheme } = useUITheme();
  const theme = themes[currentTheme];
  const isLight = currentTheme === "light";

  return (
    <div
      style={{
        height: "60px",
        backgroundColor: theme.background,
        color: theme.text,
        transition: "color 0.5s ease, background-color 0.5s ease",
        display: "flex",
        justifyContent: "end",
        alignItems: "center",
        paddingLeft: "10px",
        paddingRight: "10px",
        borderBottom: `1px solid ${theme.text}`,
      }}
    >
      <button
        style={{ width: "30px", height: "30px" }}
        onClick={() => setTheme(isLight ? "dark" : "light")}
      >
        {isLight ? <Sun /> : <Moon />}
      </button>
    </div>
  );
};
