import { type Locale } from "@packages/locale";
import { type ReactNode, useRef, useState } from "react";
import { TranslationContext } from "./TranslationContext";
import { type Translations } from "./types";

type TranslationProviderProps<T extends Locale[], K extends Translations> = {
  locales: T;
  defaultLocale?: T[number];
  translations: Record<T[number], K | Promise<K>>;
  children: ReactNode;
};

export type TranslationArgs<K extends Translations> = {
  key: keyof K;
};

type GetCurrentTranslationArgs<T extends Locale[], K extends Translations> = {
  translations: Record<T[number], K | Promise<K>>;
  locale: T[number];
};

const getCurrentTranslation = async <T extends Locale[], K extends Translations>({
  translations,
  locale,
}: GetCurrentTranslationArgs<T, K>) => {
  const translationData = translations[locale];
  if (translationData instanceof Promise) {
    const translation = await translationData;

    return translation;
  }

  return translationData;
};

export const TranslationProvider = <T extends Locale[], K extends Translations>({
  locales,
  defaultLocale,
  translations,
  children,
}: TranslationProviderProps<T, K>) => {
  const loadedTranslations = useRef<Partial<Record<T[number], K>>>({});

  const [currentTranslations, setCurrentTranslations] = useState<K>(() => {
    if (defaultLocale) {
      const current = translations[defaultLocale] as K;
      loadedTranslations.current[defaultLocale] = current;

      return current;
    }

    const defaultLanguage = navigator.language as T[number];
    const current = translations[defaultLanguage] as K;
    loadedTranslations.current[defaultLanguage] = current;

    return current;
  });

  const loadCurrentLocale = async (locale: T[number]) => {
    let translationData = loadedTranslations.current[locale];
    if (!translationData) {
      translationData = await getCurrentTranslation({ translations, locale });
      loadedTranslations.current[locale] = translationData;
    }

    setCurrentTranslations(translationData as K);
  };

  const translate = ({ key }: TranslationArgs<K>) => {
    return currentTranslations[key] ?? null;
  };

  return (
    <TranslationContext.Provider
      value={{ locales, currentTranslations, setCurrentTranslations: loadCurrentLocale, translate }}
    >
      {children}
    </TranslationContext.Provider>
  );
};
