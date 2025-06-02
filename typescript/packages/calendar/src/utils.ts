import {
  convertDateToISO,
  convertPartsToFullDate,
  getDateDay,
  Locale,
} from "@packages/date";
import { Days, FormattedDay } from "./types";
import { days, monthDetails } from "./constants";

type ArrangeDaysArgs = {
  monthStartOnDay: Days;
};

export const arrangeDays = ({ monthStartOnDay }: ArrangeDaysArgs) => {
  const index = days.findIndex((day) => day === monthStartOnDay);
  const movedPart = days.slice(0, index);
  const remaining = days.slice(index);
  remaining.push(...movedPart);
  return { arrangedDays: remaining, startDayIndex: index };
};

type SetupCurrentMonthDaysArgs = {
  month: number;
  year: number;
  locale: Locale;
  lastDay: number;
  startDayIndex: number;
  displayOtherMonthsDays: boolean;
};

export const setupCurrentMonthDays = ({
  month,
  year,
  locale,
  lastDay,
  startDayIndex,
  displayOtherMonthsDays,
}: SetupCurrentMonthDaysArgs) => {
  const daysArray: FormattedDay[] = [];

  const firstDayDate = convertPartsToFullDate({ day: 1, month, year, locale });
  const lastDayDate = convertPartsToFullDate({ day: lastDay, month, year, locale });
  const firstDayNumber = getDateDay({ date: firstDayDate, locale }) - startDayIndex;
  const lastDayNumber = getDateDay({ date: lastDayDate, locale }) - startDayIndex;

  if (firstDayNumber > 0) {
    const isFirstMonth = month === 1;
    const previousMonth = isFirstMonth ? 12 : month - 1;
    const previousMonthYear = isFirstMonth ? year - 1 : year;
    const previousMonthDetails = monthDetails[previousMonth];
    const previousMonthDays =
      typeof previousMonthDetails.days === "function"
        ? previousMonthDetails.days({ year: previousMonthYear })
        : previousMonthDetails.days;

    for (let i = previousMonthDays - firstDayNumber + 1; i <= previousMonthDays; i++) {
      const fullDate = convertPartsToFullDate({
        day: i,
        month: previousMonth,
        year: previousMonthYear,
        locale,
      });
      daysArray.push({
        day: i,
        fullDate,
        month: previousMonth,
        isCurrentMonth: false,
        isFiller: !displayOtherMonthsDays,
      });
    }
  }

  for (let i = 1; i <= lastDay; i++) {
    const fullDate = convertPartsToFullDate({ day: i, month, year, locale });
    daysArray.push({ day: i, fullDate, month, isCurrentMonth: true });
  }

  if (lastDayNumber < 6) {
    const isLastMonth = month === 12;
    const nextMonth = isLastMonth ? 1 : month + 1;
    const nextMonthYear = isLastMonth ? year + 1 : year;

    for (let i = 1; i <= 6 - lastDayNumber; i++) {
      const fullDate = convertPartsToFullDate({
        day: i,
        month: nextMonth,
        year: nextMonthYear,
        locale,
      });
      daysArray.push({
        day: i,
        fullDate,
        month: nextMonth,
        isCurrentMonth: false,
        isFiller: !displayOtherMonthsDays,
      });
    }
  }

  return daysArray;
};

type IsCellDisabledArgs = {
  fullDate: string;
  fromDateTime?: number;
  toDateTime?: number;
  locale: Locale;
};

export const isCellDisabled = ({
  fullDate,
  fromDateTime,
  toDateTime,
  locale,
}: IsCellDisabledArgs) => {
  if (!fromDateTime && !toDateTime) {
    return false;
  }

  const currentCellTime = new Date(convertDateToISO({ dateString: fullDate, locale })).getTime();
  const isAfterFromTime = fromDateTime ? currentCellTime > fromDateTime : true;
  const isBeforeToTime = toDateTime ? currentCellTime < toDateTime : true;

  return isAfterFromTime && isBeforeToTime;
};
