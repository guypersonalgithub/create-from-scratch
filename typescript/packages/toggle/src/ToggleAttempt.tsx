import { useState } from "react";
import "./toggleAttemptStyles.css";

type ToggleProps = {
  options: string[];
};

export const ToggleAttempt = ({ options }: ToggleProps) => {
  const [selected, setSelected] = useState(options[0]);

  const handleOptionClick = ({ option }: { option: string }) => {
    setSelected(option);
  };

  return (
    <div className="toggle-slider">
      <div
        className="slider"
        style={{
          transform: `translateX(${options.indexOf(selected) * 100}%)`,
        }}
      />
      {options.map((option) => (
        <button
          key={option}
          className={`option ${selected === option ? "selected" : ""}`}
          onClick={() => handleOptionClick({ option })}
        >
          {option}
        </button>
      ))}
    </div>
  );
};
