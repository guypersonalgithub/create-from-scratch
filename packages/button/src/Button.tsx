import { ButtonHTMLAttributes, CSSProperties, ReactNode, useState } from "react";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  onFocusCSS?: () => CSSProperties;
  onHoverCSS?: () => CSSProperties;
  disabledCSS?: CSSProperties;
};

export const Button = ({
  children,
  onFocusCSS,
  onHoverCSS,
  disabledCSS = {},
  disabled,
  ...rest
}: ButtonProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const onFocusStyle: CSSProperties = isFocused && onFocusCSS ? onFocusCSS() : {};
  const onHoverStyle: CSSProperties = isHovered && onHoverCSS ? onHoverCSS() : {};

  return (
    <button
      {...rest}
      disabled={disabled}
      onFocus={(e) => {
        rest.onFocus?.(e);
        setIsFocused(true);
      }}
      onMouseEnter={(e) => {
        rest.onMouseEnter?.(e);
        setIsHovered(true);
      }}
      style={{
        ...rest.style,
        ...(isFocused ? { outline: "none" } : {}),
        ...onFocusStyle,
        ...onHoverStyle,
        ...(disabled ? disabledCSS : {}),
      }}
    >
      {children}
    </button>
  );
};
