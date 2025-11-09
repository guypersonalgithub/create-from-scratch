import { useId } from "react";
import type { RadioOptionProps } from "./types";
import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";

export const RadioOption = ({
  label,
  value,
  selected,
  onChange,
  labelClassName,
  labelStyle,
}: RadioOptionProps) => {
  const id = useId();

  return (
    <label
      htmlFor={id}
      className={dynatic`
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        border-radius: 6px;
        cursor: pointer;
        transition: border 0.2s;  
      `}
      // border: `1px solid ${selected ? "#3B82F6" : "#D1D5DB"}`,
      // backgroundColor: selected ? "#EFF6FF" : "white",
    >
      <input
        id={id}
        type="radio"
        name="custom-radio"
        value={value}
        checked={selected}
        onChange={() => onChange(value)}
        className={dynatic`
            display: none;    
        `}
      />
      <span
        className={combineStringsWithSpaces(
          dynatic`
            width: 16px;
            height: 16px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          `,
          selected
            ? dynatic`
                border: 2px solid #3B82F6;
              `
            : dynatic`
                border: 2px solid #9CA3AF;
              `,
        )}
      >
        {selected ? (
          <span
            className={dynatic`
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background-color: #3B82F6;
            `}
          />
        ) : null}
      </span>
      <span
        className={combineStringsWithSpaces(
          dynatic`
            font-size: 14px;
            color: white;
          `,
          labelClassName,
        )}
        style={labelStyle}
      >
        {label}
      </span>
    </label>
  );
};
