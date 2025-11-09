import { RadioGroup } from "@packages/radio-button";
import { useState, type InputHTMLAttributes, useId } from "react";
import {
  hexToRgba,
  hexToHsl,
  rgbaToHex,
  rgbaToHsl,
  hslToHex,
  hslToRgba,
} from "@packages/css-utils";
import { dynatic } from "../../dynatic-css.config";

export const Converter = () => {
  const [selectedFrom, setSelectedFrom] = useState("hex");
  const [value, setValue] = useState("");

  const getCallbacks = () => {
    if (selectedFrom === "hex") {
      return [hexToRgba({ hex: value }), hexToHsl({ hex: value })];
    }

    if (selectedFrom === "rgba") {
      return [rgbaToHex({ rgba: value }), rgbaToHsl({ rgba: value })];
    }

    return [hslToHex({ hsl: value }), hslToRgba({ hsl: value })];
  };

  const [first, second] = getCallbacks();

  return (
    <div>
      <div
        className={dynatic`
          font-family: sans-serif;
          width: 150px;
        `}
      >
        <RadioGroup
          label="Pick an option:"
          options={[
            { label: "HEX", value: "hex" },
            { label: "RGBA", value: "rgba" },
            { label: "HSL", value: "hsl" },
          ]}
          value={selectedFrom}
          onChange={setSelectedFrom}
        />
        <div>
          <TextInput value={value} onChange={setValue} />
        </div>
      </div>
      <div
        className={dynatic`
          display: flex;
          gap: 10px;
        `}
      >
        <div>{first}</div>
        <div>{second}</div>
      </div>
    </div>
  );
};

type TextInputProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">;

export const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  ...rest
}) => {
  const id = useId();

  return (
    <div
      className={dynatic`
      display: flex;
      flex-direction: column;
      gap: 6px;
    `}
    >
      {label ? (
        <label
          htmlFor={id}
          className={dynatic`
              font-size: 14px;
              font-weight: 500;
              color: #374151;
            `}
        >
          {label}
        </label>
      ) : null}
      <input
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={dynatic`
            padding: 10px 12px;
            font-size: 14px;
            border-radius: 8px;
            outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
            box-shadow: 0 1px 2px rgba(0,0,0,0.04);
            border: 1px solid #D1D5DB;

            &:focus {
              border: 1px solid #3B82F6;
            }
          `}
        {...rest}
      />
    </div>
  );
};
