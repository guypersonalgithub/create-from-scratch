import { CSSProperties, ReactNode, useState } from "react";
import { Theme, UIThemeContext, UIThemeContextType } from "./UIThemeContext";
import { getFirstTheme } from "./utils";
import "./styles.css";

interface UIThemeProviderProps<T extends Record<string, Th>, Th extends Theme = Theme> {
  themes: T;
  defaultTheme?: keyof T;
  children: ReactNode;
  style?: CSSProperties;
  autoApplyTheme?: boolean;
}

export const UIThemeProvider = <T extends Record<string, Th>, Th extends Theme = Theme>({
  themes,
  defaultTheme = getFirstTheme({ themes }) ?? "",
  children,
  style = {},
  autoApplyTheme,
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
        className={autoApplyTheme ? "UIThemeProviderWrapper" : undefined}
        style={{
          ...style,
          ...(autoApplyTheme
            ? {
                "--theme-color": themes[currentTheme].color,
                "--theme-bg": themes[currentTheme].background,
              }
            : {}),
        }}
      >
        {children}
      </div>
    </UIThemeContext.Provider>
  );
};
