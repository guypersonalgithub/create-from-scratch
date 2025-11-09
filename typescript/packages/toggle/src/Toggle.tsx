import { useState } from "react";
import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";

type ToggleProps = {
  label?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  id?: string;
  onChange: (value: boolean) => void;
};

export const Toggle = ({ label, onChange, defaultChecked = false, disabled, id }: ToggleProps) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleToggle = () => {
    if (disabled) {
      return;
    }

    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange(newValue);
  };

  return (
    <div
      className={dynatic`
        display: flex;
        align-items: center;
        gap: 8px;
      `}
    >
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        aria-label={label}
        id={id}
        disabled={disabled}
        onClick={handleToggle}
        className={combineStringsWithSpaces(
          dynatic`
            position: relative;
            display: inline-flex;
            align-items: center;
            width: 44px;
            height: 24px;
            padding: 0;
            border: none;
            border-radius: 9999px;
            background-color: #e5e7eb;
            cursor: pointer;
            transition: background-color 0.2s ease-in-out;

            &:focus {
              outline: none;
              box-shadow: 0 0 0 2px #fff, 0 0 0 4px #4f46e5;
            }
          `,
          isChecked &&
            dynatic`
              background-color: #4f46e5;
            `,
          disabled &&
            dynatic`
              opacity: 0.5;
              cursor: not-allowed;
            `,
        )}
      >
        <span
          className={combineStringsWithSpaces(
            dynatic`
              position: absolute;
              left: 4px;
              display: inline-block;
              width: 16px;
              height: 16px;
              background-color: white;
              border-radius: 9999px;
              box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
              transition: transform 0.2s ease-in-out;
            `,
            isChecked &&
              dynatic`
                transform: translateX(20px);
              `,
          )}
        />
      </button>
      {label ? (
        <label
          htmlFor={id}
          className={combineStringsWithSpaces(
            dynatic`
              font-size: 0.875rem;
              color: #374151;
            `,
            disabled &&
              dynatic`
                color: #9ca3af;
              `,
          )}
        >
          {label}
        </label>
      ) : null}
    </div>
  );
};
