import { getUIThemeHooks } from "@packages/ui-theme";

export const customThemes = {
  light: { background: "#ffffff", color: "#000000", accent: "#f0f0f0" },
  dark: { background: "#000000", color: "#ffffff", accent: "#333333" },
};

const { useUITheme } = getUIThemeHooks({ themes: customThemes });

export { useUITheme };
