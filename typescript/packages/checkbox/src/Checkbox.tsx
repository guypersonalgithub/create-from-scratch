import { type ChangeEvent, useEffect, useState } from "react";
import "./styles.css";

type CheckboxProps = {
  checked?: boolean;
  onChange: (state: boolean) => void;
  label?: string;
};

export const Checkbox = ({ checked = false, onChange, label }: CheckboxProps) => {
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    setIsChecked(newChecked);
    onChange(newChecked);
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
