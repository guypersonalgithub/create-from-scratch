import { ChangeEvent, useState } from "react";
import "./styles.css";

type CheckboxProps = {
  checked?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement> | boolean) => void;
  label?: string;
};

export const Checkbox = ({ checked, onChange, label }: CheckboxProps) => {
  const [isChecked, setIsChecked] = useState(checked || false);

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    setIsChecked(newChecked);
    if (onChange) {
      onChange(newChecked);
    }
  };

  return (
    <label className="custom-checkbox">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
        className="custom-checkbox-input"
      />
      <span className="custom-checkbox-mark"></span>
      {label && <span className="custom-checkbox-label">{label}</span>}
    </label>
  );
};
