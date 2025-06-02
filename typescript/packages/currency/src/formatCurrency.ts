import type { Locale } from "@packages/locale";

type FormatCurrencyArgs = {
  value: number;
  locale?: Locale;
  currency?: string;
};

export const formatCurrency = ({ value, locale, currency }: FormatCurrencyArgs) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
};
