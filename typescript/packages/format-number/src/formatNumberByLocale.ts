import type { Locale } from "@packages/locale";

type FormatNumberByLocaleArgs = {
  num: number;
  locale?: Locale;
  options?: Intl.NumberFormatOptions;
};

export const formatNumberByLocale = ({
  num,
  locale = "en-US",
  options,
}: FormatNumberByLocaleArgs) => {
  const formatted = num.toLocaleString(locale, options);
  return formatted;
};
