import React, { useId } from "react";

type RadioOptionProps = {
  label: string;
  value: string;
  selected: boolean;
  onChange: (value: string) => void;
};

const RadioOption = ({ label, value, selected, onChange }: RadioOptionProps) => {
  const id = useId();

  return (
    <label
      htmlFor={id}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px",
        borderRadius: "6px",
        // border: `1px solid ${selected ? "#3B82F6" : "#D1D5DB"}`,
        // backgroundColor: selected ? "#EFF6FF" : "white",
        cursor: "pointer",
        transition: "border 0.2s",
      }}
    >
      <input
        id={id}
        type="radio"
        name="custom-radio"
        value={value}
        checked={selected}
        onChange={() => onChange(value)}
        style={{ display: "none" }}
      />
      <span
        style={{
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          border: `2px solid ${selected ? "#3B82F6" : "#9CA3AF"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selected ? (
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#3B82F6",
            }}
          />
        ) : null}
      </span>
      <span style={{ fontSize: "14px", color: "white" }}>{label}</span>
    </label>
  );
};

type RadioGroupProps = {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  label?: React.ReactNode;
};

export const RadioGroup = ({ options, value, onChange, label }: RadioGroupProps) => {
  return (
    <div role="radiogroup" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {label && <div style={{ fontWeight: "500", marginBottom: "4px" }}>{label}</div>}
      {options.map((option) => (
        <RadioOption
          key={option.value}
          label={option.label}
          value={option.value}
          selected={value === option.value}
          onChange={onChange}
        />
      ))}
    </div>
  );
};
