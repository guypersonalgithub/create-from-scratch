import { type DynaticConfiguration, dynaticInit } from "@packages/dynatic-css";

const config = {
  variants: {
    light: {
      colors: {
        mainBG: "#ffffff",
        mainColor: "#000000",
        accent: "white",
        secondaryBG: "#f8fafc",
        thirdColor: "#0077B8F9",
        layoutMainBG: "#ffffff",
        layoutBackgroundGradientSecondColor: "hsl(246 100% 77% / 0.1)",
        defaultBorder: "#e2e8f0",
        darkBackground: "#0F172A",
      },
    },
    dark: {
      colors: {
        mainBG: "#000000",
        mainColor: "#ffffff",
        accent: "#1E293B",
        secondaryBG: "#1e293b80",
        thirdColor: "#00C48C",
        layoutMainBG: "hsl(0 0% 0% / 1)",
        layoutBackgroundGradientSecondColor: "hsl(0 0% 0% / 1)",
        defaultBorder: "#334155",
        darkBackground: "#000000",
      },
    },
  },
  shared: {
    defaultTransition:
      "color 0.5s ease, background-color 0.5s ease, border 0.5s ease, opacity 0.5s ease",
    linkColor: "rgb(25, 187, 187)",
    layoutBackgroundGradientFirstColor: "hsl(201 100% 36% / 0.1)",
    white: "white",
    lightBlue: "rgba(0, 119, 184, 0.976)",
    darkerLightBlue: "rgba(0, 119, 184, 0.8)",
    lightGreen: "#059669",
    darkerLightGreen: "#067250",
    listIconBG: "#334155",
    listSubTitle: "#94A3B8",
  },
} as const satisfies DynaticConfiguration;

const classes: string[] = [];

export const { initializeDynatic, dynatic } = dynaticInit({ config, classes, base: "light" });
