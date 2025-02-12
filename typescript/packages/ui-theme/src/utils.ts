import { Theme } from "./UIThemeContext";

type GetFirstThemeArgs = {
  themes: Record<string, Theme>;
};

export const getFirstTheme = ({ themes }: GetFirstThemeArgs) => {
  for (const theme in themes) {
    return theme;
  }

  return;
};
