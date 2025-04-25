import { CSSProperties, ReactNode, useState } from "react";
import { Variants } from "./types";
import { getVariantStyles } from "./utils";

type KeyProps = {
  variant?: Variants;
  interactive?: boolean;
  children: ReactNode;
};

export const Key = ({ variant, interactive, children }: KeyProps) => {
  if (interactive) {
    return <Interactive variant={variant}>{children}</Interactive>;
  }

  return <Base variant={variant}>{children}</Base>;
};

const Interactive = ({ variant, children }: KeyProps) => {
  const [isPressed, setPressed] = useState(false);

  const customStyle = isPressed
    ? {
        transform: "translateY(1px)",
        boxShadow: "inset 0 -1px 0 #999, 0 1px 3px rgba(0, 0, 0, 0.15)",
      }
    : undefined;

  return (
    <Base
      variant={variant}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      customStyle={customStyle}
    >
      {children}
    </Base>
  );
};

type BaseProps = Omit<KeyProps, "interactive"> & {
  customStyle?: CSSProperties;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
  onMouseLeave?: () => void;
};

const Base = ({
  variant = "basic",
  customStyle,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  children,
}: BaseProps) => {
  const style = getVariantStyles({ variant });

  return (
    <div
      style={{ ...style, ...customStyle }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
};
