import { getUIThemeHooks } from "@packages/ui-theme";

export const customThemes = {
  light: { background: "#ffffff", text: "#000000", accent: "#f0f0f0", test: "3" },
  dark: { background: "#000000", text: "#ffffff", accent: "#333333" },
};

const { useUITheme } = getUIThemeHooks({ themes: customThemes });

export { useUITheme };
