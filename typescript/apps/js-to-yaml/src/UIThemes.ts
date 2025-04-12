import { getUIThemeHooks } from "@packages/ui-theme";

export const customThemes = {
  light: { background: "#ffffff", color: "#000000", accent: "white", subBackground: "#f8fafc", border: "#e2e8f0" },
  dark: { background: "#000000", color: "#ffffff", accent: "#141414", subBackground: "#1e293b80", border: "#1e293b80" },
};

const { useUITheme } = getUIThemeHooks({ themes: customThemes });

export { useUITheme };
