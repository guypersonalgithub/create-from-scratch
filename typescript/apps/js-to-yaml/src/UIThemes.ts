import { getUIThemeHooks } from "@packages/ui-theme";

export const customThemes = {
  light: {
    background: "#ffffff",
    color: "#000000",
    accent: "white",
    subBackground: "#f8fafc",
    // thirdBackground: "rgb(20, 20, 20)",
    thirdBackground: "#0F172A",
    border: "#e2e8f0",
    thirdColor: "#0077B8F9",
    thirdColorBackground: "#D1FAE5",
  },
  dark: {
    background: "#000000",
    color: "#ffffff",
    // accent: "#141414",
    accent: "#1E293B",
    subBackground: "#1e293b80",
    thirdBackground: "#000000",
    // border: "#1e293b80",
    border: "#334155",
    thirdColor: "#00C48C",
    thirdColorBackground: "#D1FAE5",
  },
};

const { useUITheme } = getUIThemeHooks({ themes: customThemes });

export { useUITheme };
