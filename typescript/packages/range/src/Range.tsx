import { type CSSProperties } from "react";

type RangeProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  style?: CSSProperties;
};

export const Range = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  style = {},
}: RangeProps) => {
  return (
    <input
      type="range"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{
        appearance: "none",
        width: "100%",
        height: "6px",
        background: "#ddd",
        borderRadius: "3px",
        outline: "none",
        padding: 0,
        margin: 0,
        ...style,
      }}
    />
  );
};
