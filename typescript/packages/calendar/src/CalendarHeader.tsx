import { dynatic } from "@packages/dynatic-css";

type CalendarHeaderProps = {
  month: string;
  year: number;
};

export const CalendarHeader = ({ month, year }: CalendarHeaderProps) => {
  return (
    <div
      className={dynatic`
        display: flex;
        justify-content: center;
        align-content: center;
      `}
    >
      {month}, {year}
    </div>
  );
};
