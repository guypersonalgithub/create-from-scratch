import { convertDateToISO, SpecificLocales } from "@packages/date";
import { CalendarCell } from "./CalendarCell";
import { FillerCell } from "./FillerCell";
import { CalendarFormat, FormattedDay } from "./types";
import { isCellDisabled } from "./utils";

type CalendarContentBodyProps = {
  daysArray: FormattedDay[];
  selectedDate: string[];
  setSelectedDate: (fullDay: string) => void;
  setMonth: (month: number) => void;
  format: CalendarFormat;
  from?: string;
  to?: string;
  locale: SpecificLocales;
};

export const CalendarContentBody = ({
  daysArray,
  selectedDate,
  setSelectedDate,
  setMonth,
  format,
  from,
  to,
  locale,
}: CalendarContentBodyProps) => {
  const fromDateTime = from
    ? new Date(convertDateToISO({ dateString: from, locale })).getTime()
    : undefined;
  const toDateTime = to
    ? new Date(convertDateToISO({ dateString: to, locale })).getTime()
    : undefined;

  if (format === "single") {
    return daysArray.map(({ day, fullDate, month, isCurrentMonth, isFiller }) => {
      if (isFiller) {
        return <FillerCell key={fullDate} />;
      }

      const [date] = selectedDate;
      const isSelected = fullDate === date;
      const isDisabled = isCellDisabled({ fullDate, fromDateTime, toDateTime, locale });

      return (
        <CalendarCell
          key={fullDate}
          day={day}
          isSelected={isSelected}
          setSelectedDate={(fullDate) => {
            setSelectedDate(fullDate);
            if (!isCurrentMonth) {
              setMonth(month);
            }
          }}
          fullDate={fullDate}
          isCurrentMonth={isCurrentMonth}
          isDisabled={isDisabled}
        />
      );
    });
  }

  const [date1, date2] = selectedDate;
  const date1Time = new Date(convertDateToISO({ dateString: date1, locale })).getTime();
  const date2Time = new Date(convertDateToISO({ dateString: date2, locale })).getTime();

  return daysArray.map(({ day, fullDate, month, isCurrentMonth, isFiller }) => {
    if (isFiller) {
      return <FillerCell key={fullDate} />;
    }

    const isSelectedLeft = fullDate === date1;
    const isSelectedRight = fullDate === date2;
    const fullDateTime = new Date(convertDateToISO({ dateString: fullDate, locale })).getTime();
    const isContained = fullDateTime > date1Time && fullDateTime < date2Time;
    const isDisabled = isCellDisabled({ fullDate, fromDateTime, toDateTime, locale });

    return (
      <CalendarCell
        key={fullDate}
        day={day}
        isSelectedLeft={isSelectedLeft}
        isSelectedRight={isSelectedRight}
        isContained={isContained}
        setSelectedDate={(fullDate) => {
          setSelectedDate(fullDate);
          if (!isCurrentMonth) {
            setMonth(month);
          }
        }}
        fullDate={fullDate}
        isCurrentMonth={isCurrentMonth}
        isDisabled={isDisabled}
      />
    );
  });
};
