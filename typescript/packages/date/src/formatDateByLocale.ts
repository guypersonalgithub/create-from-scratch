import type { Locale } from "@packages/locale";
import { getLocale } from "./utils";

type FormatDateByLocaleArgs = {
  dateString: string;
  locale?: Locale;
  timeZone?: string;
  year?: "numeric" | "2-digit";
  month?: "numeric" | "2-digit" | "long" | "short" | "narrow";
  day?: "numeric" | "2-digit";
  hour?: "numeric" | "2-digit";
  minute?: "numeric" | "2-digit";
  second?: "numeric" | "2-digit";
  hour12?: boolean;
};

export const formatDateByLocale = ({
  dateString,
  locale,
  timeZone,
  year = "numeric",
  month = "2-digit",
  day = "2-digit",
  hour,
  minute,
  second,
  hour12,
}: FormatDateByLocaleArgs) => {
  const date = new Date(dateString);

  const userLocale = locale || getLocale();
  const userTimeZone = timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const options: Intl.DateTimeFormatOptions = {
    year,
    month,
    day,
    hour,
    minute,
    second,
    hour12,
    timeZone: userTimeZone,
  };

  const dateFormatter = new Intl.DateTimeFormat(userLocale, options);

  const formattedDate = dateFormatter.format(date);

  return formattedDate;
};
