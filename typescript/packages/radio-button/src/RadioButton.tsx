import { dynatic } from "@packages/dynatic-css";
import { RadioOption } from "./RadioOption";
import type { RadioOptionProps } from "./types";
import type { ReactNode } from "react";

type RadioGroupProps = Pick<RadioOptionProps, "onChange" | "labelClassName" | "labelStyle"> & {
  options: { label: string; value: string }[];
  value: string;
  label?: ReactNode;
};

export const RadioGroup = ({
  options,
  value,
  onChange,
  label,
  labelClassName,
  labelStyle,
}: RadioGroupProps) => {
  return (
    <div
      role="radiogroup"
      className={dynatic`
        display: flex;
        flex-direction: column;
        gap: 8px;
      `}
    >
      {label ? (
        <div
          className={dynatic`
            font-weight: 500;
            margin-bottom: 4px;
          `}
        >
          {label}
        </div>
      ) : null}
      {options.map((option) => (
        <RadioOption
          key={option.value}
          label={option.label}
          value={option.value}
          selected={value === option.value}
          onChange={onChange}
          labelClassName={labelClassName}
          labelStyle={labelStyle}
        />
      ))}
    </div>
  );
};
