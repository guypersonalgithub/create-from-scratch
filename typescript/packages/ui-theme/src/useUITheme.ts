import { useContext } from "react";
import { Theme, UIThemeContext, UIThemeContextType } from "./UIThemeContext";

type GetUIThemeHooksArgs<T extends Record<string, Th>, Th extends Theme = Theme> = {
  themes: T;
};

export const getUIThemeHooks = <T extends Record<string, Th>, Th extends Theme = Theme>({
  themes,
}: GetUIThemeHooksArgs<T>) => {
  const useUITheme = (): UIThemeContextType<T> => {
    const context = useContext(UIThemeContext);
    if (!context) {
      throw new Error("useUITheme must be used within a UIThemeProvider");
    }
    return context as UIThemeContextType<T>;
  };

  return { useUITheme };
};
