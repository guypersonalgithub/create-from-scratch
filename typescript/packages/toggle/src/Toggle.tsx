import { useState } from "react";
import "./styles.css";

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
    <div className="toggle-container">
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        aria-label={label}
        id={id}
        disabled={disabled}
        onClick={handleToggle}
        className={`toggle-switch ${isChecked ? "checked" : ""} ${disabled ? "disabled" : ""}`}
      >
        <span className={`toggle-slider ${isChecked ? "checked" : ""}`} />
      </button>
      {label ? (
        <label htmlFor={id} className={`toggle-label ${disabled ? "disabled" : ""}`}>
          {label}
        </label>
      ) : null}
    </div>
  );
};
