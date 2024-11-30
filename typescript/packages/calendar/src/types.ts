import { days } from "./constants";

export type CalendarFormat = "single" | "range";
export type Days = (typeof days)[number];
export type FormattedDay = {
  day: number;
  fullDate: string;
  month: number;
  isCurrentMonth: boolean;
  isFiller?: boolean;
};
