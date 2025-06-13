import { type CSSProperties, useState } from "react";

type BackspaceProps = {
  interactive?: boolean;
};

export const Backspace = ({ interactive }: BackspaceProps) => {
  if (interactive) {
    return <Interactive />;
  }

  return <Base />;
};

const Interactive = () => {
  const [isPressed, setPressed] = useState(false);

  const customStyle = isPressed
    ? {
        transform: "translateY(1px)",
        boxShadow: "inset 0 -1px 0 #999, 0 1px 3px rgba(0, 0, 0, 0.15)",
      }
    : undefined;

  return (
    <Base
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      customStyle={customStyle}
    />
  );
};

type BaseProps = {
  customStyle?: CSSProperties;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
  onMouseLeave?: () => void;
};

const Base = ({ customStyle, onMouseDown, onMouseUp, onMouseLeave }: BaseProps) => {
  const BackspaceStyle: CSSProperties = {
    display: "inline-block",
    padding: "10px 20px",
    backgroundColor: "#ccc",
    border: "1px solid #999",
    borderRadius: "6px",
    fontFamily: "monospace",
    fontSize: "14px",
    userSelect: "none",
    clipPath: "polygon(0% 50%, 10% 0%, 100% 0%, 100% 100%, 10% 100%)",
  };

  return (
    <div
      style={{ ...BackspaceStyle, ...customStyle }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    />
  );
};
