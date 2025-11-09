import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { useState } from "react";

type RatingProps = {
  value?: number;
  defaultValue?: number;
  max?: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  className?: string;
  size?: number;
  itemClassName?: string;
  color?: string;
};

export const Rating = ({
  value,
  defaultValue = 0,
  max = 5,
  onChange,
  readOnly = false,
  className,
  size,
  itemClassName,
  color,
}: RatingProps) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [internalValue, setInternalValue] = useState<number>(defaultValue);

  const isControlled = value !== undefined;
  const displayValue = isControlled ? value : internalValue;

  const handleClick = (index: number) => {
    if (readOnly) {
      return;
    }

    const nextValue = internalValue !== index ? index : 0;

    if (!isControlled) {
      setInternalValue(nextValue);
    }

    setHovered(null);

    onChange?.(nextValue);
  };

  return (
    <div
      className={combineStringsWithSpaces(
        dynatic`
          display: flex;
        `,
        readOnly
          ? dynatic`
              cursor: default;
            `
          : dynatic`
              cursor: pointer;
            `,
        className,
      )}
      role="radiogroup"
    >
      {Array.from({ length: max }, (_, i) => {
        const index = i + 1;
        const filled = hovered !== null ? index <= hovered : index <= displayValue;

        return (
          <span
            key={index}
            role="radio"
            aria-checked={index === displayValue}
            tabIndex={readOnly ? -1 : 0}
            onClick={() => handleClick(index)}
            onMouseEnter={() => !readOnly && setHovered(index)}
            onMouseLeave={() => !readOnly && setHovered(null)}
            onKeyDown={(e) => {
              if (!readOnly && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                handleClick(index);
              }
            }}
            className={combineStringsWithSpaces(
              dynatic`
                font-size: 24px;
                transition: color 0.2s ease;
                outline: none;
                user-select: none;
              `,
              filled
                ? color
                  ? dynatic`
                    color: ${color};
                  `
                  : dynatic`
                    color: #FFD700;
                  `
                : dynatic`
                    color: #ccc;
                  `,
              size &&
                dynatic`
                  font-size: ${size};
                `,
              itemClassName,
            )}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};
