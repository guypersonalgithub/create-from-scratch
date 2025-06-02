import { createContext } from "react";
import type { Locale } from "@packages/locale";
import { Translations } from "./types";
import { TranslationArgs } from "./TranslationProvider";

export type TranslationContextProps<T extends Locale[], K extends Translations> = {
  locales: T;
  currentTranslations: K;
  setCurrentTranslations: (translations: K) => void;
  translate: (args: TranslationArgs<K>) => K[keyof K];
};

export const TranslationContext = createContext<TranslationContextProps<any, any> | null>(null);
