import { useState } from "react";
import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";

type ToggleProps = {
  options: string[];
};

export const ToggleAttempt = ({ options }: ToggleProps) => {
  const [selected, setSelected] = useState(options[0]);

  const handleOptionClick = ({ option }: { option: string }) => {
    setSelected(option);
  };

  return (
    <div
      // className={dynatic`
      //   display: flex;
      //   position: relative;
      //   width: 200px;
      //   height: 40px;
      //   background-color: #f0f0f0;
      //   border-radius: 20px;
      //   overflow: hidden;
      // `}
    >
      <div
        className={dynatic`
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          background-color: #007bff;
          border-radius: 20px;
          z-index: 1;
          transition: transform 0.3s ease;  
        `}
        style={{
          transform: `translateX(${options.indexOf(selected) * 100}%)`,
        }}
      />
      {options.map((option) => (
        <button
          key={option}
          className={combineStringsWithSpaces(
            dynatic`
              flex: 1;
              text-align: center;
              border: none;
              background: none;
              cursor: pointer;
              z-index: 2;
              font-size: 16px;
              color: #333;
              position: relative;
              outline: none;
              transition: color 0.3s ease;
            `,
            selected === option &&
              dynatic`
                color: #fff;
              `,
          )}
          onClick={() => handleOptionClick({ option })}
        >
          {option}
        </button>
      ))}
    </div>
  );
};
