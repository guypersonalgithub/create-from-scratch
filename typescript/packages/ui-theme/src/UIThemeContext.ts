import { createContext } from "react";

export type Theme = {
  [key: string]: string | number;
};

export type UIThemeContextType<T extends Record<string, Th>, Th extends Theme = Theme> = {
  currentTheme: keyof T;
  themes: T;
  setTheme: (theme: keyof T) => void;
}

export const UIThemeContext = createContext<UIThemeContextType<any> | null>(null);