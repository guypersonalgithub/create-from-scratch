import { useUITheme } from "../UIThemes";
import { ReactNode } from "react";

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
