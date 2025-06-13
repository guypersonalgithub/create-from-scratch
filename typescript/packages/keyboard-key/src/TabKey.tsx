import { type CSSProperties, useState } from "react";

type TabKeyProps = {
  interactive?: boolean;
};

export const TabKey = ({ interactive }: TabKeyProps) => {
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
  const style: CSSProperties = {
    display: "inline-block",
    padding: "10px 24px",
    backgroundColor: "#eee",
    border: "1px solid #bbb",
    borderRadius: "20px",
    fontFamily: "monospace",
    fontSize: "14px",
    userSelect: "none",
    position: "relative",
  };

  const tabArrowStyle: CSSProperties = {
    position: "absolute",
    left: "8px",
    top: "50%",
    transform: "translateY(-50%)",
  };

  return (
    <div
      style={{ ...style, ...customStyle }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      <span style={tabArrowStyle}>⇥</span> Tab
    </div>
  );
};
