import { Locale } from "@packages/locale";
import { useContext } from "react";
import { TranslationContext, TranslationContextProps } from "./TranslationContext";

type GetTranslationHooksArgs<T extends Locale[]> = {
  locales: T;
};

export const getTranslationHooks = <T extends Locale[]>({
  locales,
}: GetTranslationHooksArgs<T>) => {
  const useTranslation = (): TranslationContextProps<T> => {
    const context = useContext(TranslationContext);
    if (!context) {
      throw new Error("useUITheme must be used within a UIThemeProvider");
    }
    return context as TranslationContextProps<T>;
  };

  return { useTranslation };
};
