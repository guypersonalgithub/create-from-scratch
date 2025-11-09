import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { type CSSProperties, useState } from "react";

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
    return dynatic`
      background-color: red;
    `;
  }

  if (isSelected || isSelectedLeft || isSelectedRight) {
    return dynatic`
      background-color: lightblue;
    `;
  }
};

type GetBorderRadiusArgs = {
  isSelectedLeft?: boolean;
  isSelectedRight?: boolean;
};

const getBorderRadius = ({ isSelectedLeft, isSelectedRight }: GetBorderRadiusArgs) => {
  if (isSelectedLeft && isSelectedRight) {
    return dynatic`
      border-radius: 5px;
    `;
  }

  if (isSelectedLeft) {
    return dynatic`
      border-radius: 5px 0px 0px 5px;
    `;
  }

  if (isSelectedRight) {
    return dynatic`
      border-radius: 0px 5px 5px 0px;
    `;
  }

  return dynatic`
    border-radius: 5px;
  `;
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
  wrapperClassName?: string;
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
  wrapperClassName,
  wrapperStyle,
}: CalendarCellProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={combineStringsWithSpaces(
        isContained &&
          dynatic`
            background-color: lightblue;
          `,
        isDisabled &&
          dynatic`
            background-color: darkgrey;
            pointer-events: none;
            cursor: not-allowed;
          `,
        wrapperClassName,
      )}
      style={wrapperStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={combineStringsWithSpaces(
          dynatic`
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          `,
          getBackgroundColor({
            isHovered,
            isSelected,
            isSelectedLeft,
            isSelectedRight,
          }),
          getBorderRadius({ isSelectedLeft, isSelectedRight }),
          isCurrentMonth
            ? dynatic`
                opacity: 1;
              `
            : dynatic`
                opacity: 0.5;
              `,
        )}
        onClick={() => setSelectedDate(fullDate)}
      >
        <div>{day}</div>
      </div>
    </div>
  );
};
