import { type CSSProperties } from "react";
import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";

type RangeProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  style?: CSSProperties;
};

export const Range = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  className,
  style,
}: RangeProps) => {
  return (
    <input
      type="range"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(Number(e.target.value))}
      className={combineStringsWithSpaces(
        dynatic`
          appearance: none;
          width: 100%;
          height: 6px;
          background: #ddd;
          border-radius: 3px;
          outline: none;
          padding: 0;
          margin: 0;
        `,
        className,
      )}
      style={style}
    />
  );
};
