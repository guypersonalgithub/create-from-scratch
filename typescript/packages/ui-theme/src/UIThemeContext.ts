import { createContext } from "react";

export type Theme = {
  [key: string]: string;
};

export interface UIThemeContextType<T extends Record<string, Th>, Th extends Theme = Theme> {
  currentTheme: keyof T;
  themes: T;
  setTheme: (theme: keyof T) => void;
}

// Create a context with a generic default value of `null`
export const UIThemeContext = createContext<UIThemeContextType<any> | null>(null);