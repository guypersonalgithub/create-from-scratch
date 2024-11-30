import { SpecificLocales } from "./types";

export const getLocale = () => {
  return Intl.DateTimeFormat().resolvedOptions().locale;
};

type GetDateDayArgs = {
  date: string;
  locale: SpecificLocales;
};

export const getDateDay = ({ date, locale }: GetDateDayArgs) => {
  return new Date(convertDateToISO({ dateString: date, locale })).getDay();
};

type getDateSplitterCharArgs = {
  dateString: string;
};

const getDateSplitterChar = ({ dateString }: getDateSplitterCharArgs) => {
  const potentialSplitterChars = ["/", "-", "."];

  for (let i = 0; i < potentialSplitterChars.length; i++) {
    const currentChar = potentialSplitterChars[i];
    if (dateString.includes(currentChar)) {
      return currentChar;
    }
  }

  return "/";
};

type SplitDateArgs = {
  formattedDate: string;
  locale: SpecificLocales;
};

export const splitDate = ({ formattedDate, locale }: SplitDateArgs) => {
  const splitDate = formattedDate.split(getDateSplitterChar({ dateString: formattedDate }));
  if (locale === "en-US") {
    const [month, day, year] = splitDate;

    return {
      day: Number(day),
      month: Number(month),
      year: Number(year),
    };
  }

  const [day, month, year] = splitDate;

  return {
    day: Number(day),
    month: Number(month),
    year: Number(year),
  };
};

type ConvertPartsToFullDateArgs = {
  day: number | string;
  month: number | string;
  year: number | string;
  locale: SpecificLocales;
};

export const convertPartsToFullDate = ({
  day,
  month,
  year,
  locale,
}: ConvertPartsToFullDateArgs) => {
  if (locale === "en-US") {
    return `${month}/${day}/${year}`;
  }

  return `${day}/${month}/${year}`;
};

type ConvertDateToISOArgs = {
  dateString: string;
  locale?: SpecificLocales;
};

export const convertDateToISO = ({ dateString, locale = getLocale() }: ConvertDateToISOArgs) => {
  const { day, month, year } = splitDate({ formattedDate: dateString, locale });

  return `${year}-${month}-${day}`;
};
