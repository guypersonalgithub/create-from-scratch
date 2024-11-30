import { CSSProperties, useState } from "react";

type GetBackgroundColorArgs = {
  isHovered: boolean;
  isSelected?: boolean;
  isSelectedLeft?: boolean;
  isSelectedRight?: boolean;
};

const getBackgroundColor = ({
  isHovered,
  isSelected,
  isSelectedLeft,
  isSelectedRight,
}: GetBackgroundColorArgs) => {
  if (isHovered) {
    return "red";
  }

  if (isSelected || isSelectedLeft || isSelectedRight) {
    return "lightblue";
  }
};

type GetBorderRadiusArgs = {
  isSelectedLeft?: boolean;
  isSelectedRight?: boolean;
};

const getBorderRadius = ({ isSelectedLeft, isSelectedRight }: GetBorderRadiusArgs) => {
  if (isSelectedLeft && isSelectedRight) {
    return "5px";
  }

  if (isSelectedLeft) {
    return "5px 0px 0px 5px";
  }

  if (isSelectedRight) {
    return "0px 5px 5px 0px";
  }

  return "5px";
};

type CalendarCellProps = {
  day: number;
  isSelected?: boolean;
  isSelectedLeft?: boolean;
  isSelectedRight?: boolean;
  isContained?: boolean;
  setSelectedDate: (fullDate: string) => void;
  fullDate: string;
  isCurrentMonth: boolean;
  isDisabled?: boolean;
  wrapperStyle?: CSSProperties;
};

export const CalendarCell = ({
  day,
  isSelected,
  isSelectedLeft,
  isSelectedRight,
  isContained,
  setSelectedDate,
  fullDate,
  isCurrentMonth,
  isDisabled,
  wrapperStyle = {},
}: CalendarCellProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        backgroundColor: isContained ? "lightblue" : undefined,
        ...wrapperStyle,
        ...(isDisabled
          ? { backgroundColor: "darkgrey", pointerEvents: "none", cursor: "not-allowed" }
          : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          width: "50px",
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: getBackgroundColor({ isHovered, isSelected, isSelectedLeft, isSelectedRight }),
          borderRadius: getBorderRadius({ isSelectedLeft, isSelectedRight }),
          cursor: "pointer",
          opacity: isCurrentMonth ? 1 : 0.5,
        }}
        onClick={() => setSelectedDate(fullDate)}
      >
        <div>{day}</div>
      </div>
    </div>
  );
};
