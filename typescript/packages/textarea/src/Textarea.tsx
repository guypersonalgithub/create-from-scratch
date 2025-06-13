import { type CSSProperties, type TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  containerStyle?: CSSProperties;
};

export const Textarea: React.FC<TextareaProps> = ({ containerStyle, label, ...props }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", ...containerStyle }}>
      {label ? (
        <label
          htmlFor={props.id}
          style={{
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "#333",
          }}
        >
          {label}
        </label>
      ) : null}
      <textarea
        {...props}
        style={{
          padding: "0.75rem 1rem",
          border: "1px solid #ccc",
          borderRadius: "0.5rem",
          fontSize: "1rem",
          fontFamily: "inherit",
          resize: "none",
          minHeight: "120px",
          outline: "none",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          transition: "border 0.2s, box-shadow 0.2s",
          ...props.style,
        }}
        onFocus={(e) => (e.currentTarget.style.border = "1px solid #FFD54F")}
        onBlur={(e) => (e.currentTarget.style.border = "1px solid #ccc")}
      />
    </div>
  );
};
