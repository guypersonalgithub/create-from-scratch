import { type Locale } from "@packages/locale";
import { useContext } from "react";
import { TranslationContext, type TranslationContextProps } from "./TranslationContext";
import type { Translations } from "./types";

type GetTranslationHooksArgs<T extends Locale[]> = {
  locales: T;
};

export const getTranslationHooks = <T extends Locale[], K extends Translations>({
  locales,
}: GetTranslationHooksArgs<T>) => {
  const useTranslation = (): TranslationContextProps<T, K> => {
    const context = useContext(TranslationContext);
    if (!context) {
      throw new Error("useUITheme must be used within a UIThemeProvider");
    }

    return context as TranslationContextProps<T, K>;
  };

  return { useTranslation };
};
