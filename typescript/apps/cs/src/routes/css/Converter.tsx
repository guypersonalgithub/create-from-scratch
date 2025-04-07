import { RadioGroup } from "@packages/radio-button";
import { useState, InputHTMLAttributes, useId } from "react";
import {
  hexToRgba,
  hexToHsl,
  rgbaToHex,
  rgbaToHsl,
  hslToHex,
  hslToRgba,
} from "@packages/css-utils";

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
      <div style={{ fontFamily: "sans-serif", width: "150px" }}>
        <RadioGroup
          label="Pick a fruit:"
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
      <div style={{ display: "flex", gap: "10px" }}>
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
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            fontSize: "14px",
            fontWeight: 500,
            color: "#374151",
          }}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "10px 12px",
          fontSize: "14px",
          borderRadius: "8px",
          border: "1px solid #D1D5DB",
          outline: "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "#3B82F6")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "#D1D5DB")}
        {...rest}
      />
    </div>
  );
};
