import { CSSProperties, ReactNode, useState } from "react";
import { Theme, UIThemeContext, UIThemeContextType } from "./UIThemeContext";
import { getFirstTheme } from "./utils";
import "./styles.css";

interface UIThemeProviderProps<T extends Record<string, Th>, Th extends Theme = Theme> {
  themes: T;
  defaultTheme?: keyof T;
  children: ReactNode;
  style?: CSSProperties;
}

export const UIThemeProvider = <T extends Record<string, Th>, Th extends Theme = Theme>({
  themes,
  defaultTheme = getFirstTheme({ themes }) ?? "",
  children,
  style = {},
}: UIThemeProviderProps<T>) => {
  const [currentTheme, setCurrentTheme] = useState<keyof T>(defaultTheme);

  const contextValue: UIThemeContextType<T> = {
    currentTheme,
    themes,
    setTheme: (theme) => {
      if (theme in themes) {
        setCurrentTheme(theme);
      }
    },
  };

  return (
    <UIThemeContext.Provider value={contextValue}>
      <div
        style={{
          ...style,
          ...{
            "--theme-color": themes[currentTheme].color,
            "--theme-bg": themes[currentTheme].background,
            "--theme-transition": style.transition,
          },
        }}
      >
        {children}
      </div>
    </UIThemeContext.Provider>
  );
};
