import { ReactNode, useState } from "react";
import { Theme, UIThemeContext, UIThemeContextType } from "./UIThemeContext";
import { getFirstTheme } from "./utils";

interface UIThemeProviderProps<T extends Record<string, Th>, Th extends Theme = Theme> {
  themes: T;
  defaultTheme?: keyof T;
  children: ReactNode;
}

export const UIThemeProvider = <T extends Record<string, Th>, Th extends Theme = Theme>({
  themes,
  defaultTheme = getFirstTheme({ themes }) ?? "",
  children,
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

  return <UIThemeContext.Provider value={contextValue}>{children}</UIThemeContext.Provider>;
};
