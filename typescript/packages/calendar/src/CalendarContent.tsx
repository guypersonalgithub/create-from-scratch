import { SpecificLocales } from "@packages/date";
import { arrangeDays, setupCurrentMonthDays } from "./utils";
import { CalendarFormat, Days } from "./types";
import { CalendarContentBody } from "./CalendarContentBody";
import { FillerCell } from "./FillerCell";

type CalendarContentProps = {
  days: number;
  month: number;
  year: number;
  locale: SpecificLocales;
  setSelectedDate: (fullDay: string) => void;
  monthStartOnDay: Days;
  setMonth: (month: number) => void;
  selectedDate: string[];
  format: CalendarFormat;
  displayOtherMonthsDays: boolean;
  from?: string;
  to?: string;
};

export const CalendarContent = ({
  days,
  month,
  year,
  locale,
  selectedDate,
  setSelectedDate,
  monthStartOnDay,
  setMonth,
  format,
  displayOtherMonthsDays,
  from,
  to,
}: CalendarContentProps) => {
  const { arrangedDays, startDayIndex } = arrangeDays({ monthStartOnDay });
  const daysArray = setupCurrentMonthDays({
    month: month,
    year,
    locale,
    lastDay: days,
    startDayIndex,
    displayOtherMonthsDays,
  });

  const shouldAddAnAdditionalFillerRow = daysArray.length < 42;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr",
      }}
    >
      {arrangedDays.map((day) => {
        return (
          <div
            key={day}
            style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
          >
            {day.slice(0, 3)}
          </div>
        );
      })}
      <CalendarContentBody
        daysArray={daysArray}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        setMonth={setMonth}
        format={format}
        from={from}
        to={to}
        locale={locale}
      />
      {shouldAddAnAdditionalFillerRow
        ? Array.from({ length: 7 }).map((_, index) => {
            return <FillerCell key={index} />;
          })
        : null}
    </div>
  );
};
