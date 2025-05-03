type FormatCurrencyArgs = {
  value: number;
  locale?: string;
  currency?: string;
};

export const formatCurrency = ({ value, locale, currency }: FormatCurrencyArgs) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
};
