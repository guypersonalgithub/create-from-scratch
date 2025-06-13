import { type SupportedLanguages } from "../languages";
import { type Variant } from "./types";

type GetDisplayableLanguageArgs = {
  language: SupportedLanguages;
};

export const getDisplayableLanguage = ({ language }: GetDisplayableLanguageArgs) => {
  const displayedLanguages: Record<SupportedLanguages, string> = {
    typescript: "Typescript",
    yaml: "YAML",
  };

  return displayedLanguages[language];
};

type GetVariantColorsArgs = {
  variant: Variant;
};

export const getVariantColors = ({ variant }: GetVariantColorsArgs) => {
  const variantColors: Record<
    Variant,
    {
      headerBackgroundColor: string;
      headerColor: string;
      border: string;
      contentBackgroundColor: string;
      contentColor: string;
    }
  > = {
    dark: {
      headerBackgroundColor: "#1e293b",
      headerColor: "white",
      border: "#334155",
      contentBackgroundColor: "#0f172a",
      contentColor: "#f1f5f9",
    },
    green: {
      headerBackgroundColor: "#065f46",
      headerColor: "white",
      border: "#059669",
      contentBackgroundColor: "#064e3b",
      contentColor: "#f1f5f9",
    },
    blue: {
      headerBackgroundColor: "#1e293b",
      headerColor: "white",
      border: "#334155",
      contentBackgroundColor: "#0f172a",
      contentColor: "#f1f5f9",
    },
  };

  return variantColors[variant];
};
