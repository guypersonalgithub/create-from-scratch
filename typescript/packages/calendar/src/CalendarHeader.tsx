type CalendarHeaderProps = {
  month: string;
  year: number;
};

export const CalendarHeader = ({ month, year }: CalendarHeaderProps) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
      {month}, {year}
    </div>
  );
};
