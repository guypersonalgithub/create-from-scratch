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
        display: "flex",
        justifyContent: "end",
        alignItems: "center",
        paddingLeft: "10px",
        paddingRight: "10px",
        borderBottom: `1px solid ${theme.color}`,
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
