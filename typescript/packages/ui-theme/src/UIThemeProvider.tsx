import { type CSSProperties, type ReactNode, useState } from "react";
import { type Theme, UIThemeContext, type UIThemeContextType } from "./UIThemeContext";
import { getFirstTheme } from "./utils";
import "./styles.css";

type UIThemeProviderProps<T extends Record<string, Th>, Th extends Theme = Theme> = {
  themes: T;
  defaultTheme?: keyof T;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export const UIThemeProvider = <T extends Record<string, Th>, Th extends Theme = Theme>({
  themes,
  defaultTheme = getFirstTheme({ themes }) ?? "",
  children,
  className,
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

  const themeStyle: CSSProperties & { [key: string]: string | number | undefined } = {
    ...style,
    "--theme-transition": style.transition,
  };
  for (const property in themes[currentTheme]) {
    const value = themes[currentTheme][property];
    const key = `--theme-${property}`;
    themeStyle[key] = value;
  }

  return (
    <UIThemeContext.Provider value={contextValue}>
      <div className={className} style={themeStyle}>
        {children}
      </div>
    </UIThemeContext.Provider>
  );
};
