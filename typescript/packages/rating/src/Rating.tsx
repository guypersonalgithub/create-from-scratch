import { useState } from "react";

type RatingProps = {
  value?: number;
  defaultValue?: number;
  max?: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  className?: string;
  size?: number;
  color?: string;
};

export const Rating = ({
  value,
  defaultValue = 0,
  max = 5,
  onChange,
  readOnly = false,
  className = "",
  size = 24,
  color = "#FFD700",
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
      className={className}
      role="radiogroup"
      style={{ display: "flex", cursor: readOnly ? "default" : "pointer" }}
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
            style={{
              fontSize: size,
              color: filled ? color : "#ccc",
              transition: "color 0.2s ease",
              outline: "none",
              userSelect: "none",
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};
