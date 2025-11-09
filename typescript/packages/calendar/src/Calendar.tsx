import {
  convertDateToISO,
  formatDateByLocale,
  getLocale,
  type Locale,
  splitDate,
} from "@packages/date";
import { ArrowRight, ArrowLeft } from "@packages/icons";
import { CalendarHeader } from "./CalendarHeader";
import { type CSSProperties, useRef, useState } from "react";
import { monthDetails } from "./constants";
import { CalendarContent } from "./CalendarContent";
import { type CalendarFormat, type Days } from "./types";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { dynatic } from "@packages/dynatic-css";

type CalendarProps = {
  startDate?: string;
  locale?: Locale;
  containerClassName?: string;
  containerStyle?: CSSProperties;
  calendarClassName?: string;
  calendarStyle?: CSSProperties;
  format: CalendarFormat;
  monthStartOnDay: Days;
  amountOfMonths?: number;
  from?: string;
  to?: string;
};

export const Calendar = ({
  startDate,
  locale = getLocale(),
  containerClassName,
  containerStyle,
  calendarClassName,
  calendarStyle,
  format,
  monthStartOnDay,
  amountOfMonths = 1,
  from,
  to,
}: CalendarProps) => {
  const formattedDate = formatDateByLocale({
    dateString: startDate ?? new Date().toString(),
    locale,
  });
  const { month: splitMonth, year: splitYear } = splitDate({ formattedDate, locale });
  const [year, setYear] = useState<number>(splitYear);
  const [month, setMonth] = useState<number>(splitMonth);
  const [selectedDate, setSelectedDate] = useState<string[]>(
    format === "range" ? [formattedDate, formattedDate] : [formattedDate],
  );
  const insertedDateIndex = useRef<number>(undefined);

  const displayedCalendarMonthsArray = Array.from({ length: amountOfMonths });

  return (
    <div className={containerClassName} style={containerStyle}>
      <div
        className={combineStringsWithSpaces(
          dynatic`
            display: flex;
            align-items: center;
            justify-content: space-around;
          `,
          calendarClassName,
        )}
        style={calendarStyle}
      >
        <div
          className={dynatic`
            cursor: pointer;
          `}
          onClick={() => {
            if (month === 1) {
              setYear(year - 1);
              setMonth(12);

              return;
            }

            setMonth(month - 1);
          }}
        >
          <ArrowLeft
            className={dynatic`
              width: 20px;
              height: 20px;
            `}
          />
        </div>
        {displayedCalendarMonthsArray.map((_, index) => {
          const expectedMonthNumber = month + index;
          const isExpectedAbove12 = expectedMonthNumber > 12;
          const currentMonth = isExpectedAbove12 ? expectedMonthNumber - 12 : expectedMonthNumber;
          const currentYear = isExpectedAbove12 ? year + 1 : year;
          const { name, days } = monthDetails[currentMonth];
          const daysValue = typeof days === "function" ? days({ year }) : days;

          return (
            <div key={`calendar-month-${index}`}>
              <CalendarHeader month={name} year={currentYear} />
              <CalendarContent
                days={daysValue}
                month={currentMonth}
                year={currentYear}
                locale={locale}
                selectedDate={selectedDate}
                setSelectedDate={(fullDate) => {
                  if (format === "single") {
                    setSelectedDate([fullDate]);

                    return;
                  }

                  setSelectedDate((prev) => {
                    const [firstDate, secondDate] = prev;
                    const fullDateTime = new Date(
                      convertDateToISO({ dateString: fullDate, locale }),
                    ).getTime();

                    if (firstDate === secondDate) {
                      const firstDateTime = new Date(
                        convertDateToISO({ dateString: firstDate, locale }),
                      ).getTime();
                      insertedDateIndex.current = 0;
                      if (fullDateTime > firstDateTime) {
                        return [firstDate, fullDate];
                      } else {
                        return [fullDate, secondDate];
                      }
                    }

                    if (insertedDateIndex.current === 0) {
                      const firstDateTime = new Date(
                        convertDateToISO({ dateString: firstDate, locale }),
                      ).getTime();

                      if (fullDateTime < firstDateTime) {
                        return [fullDate, fullDate];
                      }

                      insertedDateIndex.current = 1;

                      return [firstDate, fullDate];
                    }

                    const secondDateTime = new Date(
                      convertDateToISO({ dateString: secondDate, locale }),
                    ).getTime();

                    if (fullDateTime > secondDateTime) {
                      return [fullDate, fullDate];
                    }

                    insertedDateIndex.current = 0;

                    return [fullDate, secondDate];
                  });
                }}
                format={format}
                monthStartOnDay={monthStartOnDay}
                setMonth={setMonth}
                displayOtherMonthsDays={amountOfMonths === 1}
                from={from}
                to={to}
              />
            </div>
          );
        })}
        <div
          className={dynatic`
            cursor: pointer;
          `}
          onClick={() => {
            if (month === 12) {
              setYear(year + 1);
              setMonth(1);

              return;
            }

            setMonth(month + 1);
          }}
        >
          <ArrowRight
            className={dynatic`
              width: 20px;
              height: 20px;
            `}
          />
        </div>
      </div>
    </div>
  );
};
