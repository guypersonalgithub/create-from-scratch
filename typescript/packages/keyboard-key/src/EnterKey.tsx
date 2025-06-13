import { type CSSProperties, useState } from "react";

type EnterKeyProps = {
  interactive?: boolean;
};

export const EnterKey = ({ interactive }: EnterKeyProps) => {
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
  const enterKeyStyle: CSSProperties = {
    display: "inline-block",
    padding: "10px 30px 10px 16px",
    backgroundColor: "#ddd",
    border: "1px solid #aaa",
    borderRadius: "6px 6px 12px 6px",
    fontFamily: "monospace",
    fontSize: "14px",
    position: "relative",
    userSelect: "none",
  };

  const enterArrowStyle: CSSProperties = {
    position: "absolute",
    right: "8px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "16px",
  };

  return (
    <div
      style={{ ...enterKeyStyle, ...customStyle }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      Enter
      <span style={enterArrowStyle}>↩︎</span>
    </div>
  );
};
