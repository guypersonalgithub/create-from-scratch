import { dynatic } from "@packages/dynatic-css";
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

type GetVariantClassNamesArgs = {
  variant: Variant;
};

export const getVariantClassNames = ({ variant }: GetVariantClassNamesArgs) => {
  const variantClassNames: Record<
    Variant,
    { headerClassName: string; contentClassName: string }
  > = {
    dark: {
      headerClassName: dynatic`
        background-color: #1e293b;
        border-bottom: #334155;
      `,
      contentClassName: dynatic`
        background-color: #0f172a;
        color: #f1f5f9;
      `,
    },
    green: {
      headerClassName: dynatic`
        background-color: #065f46;
        border-bottom: #059669;
      `,
      contentClassName: dynatic`
        background-color: #064e3b;
        color: #f1f5f9;
      `,
    },
    blue: {
      headerClassName: dynatic`
        background-color: #1e293b;
        border-bottom: #334155;
      `,
      contentClassName: dynatic`
        background-color: #0f172a;
        color: #f1f5f9;
      `,
    },
  };

  return variantClassNames[variant];
};
