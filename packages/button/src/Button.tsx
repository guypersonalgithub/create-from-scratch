import { ButtonHTMLAttributes, CSSProperties, ReactNode, useState } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  onFocusCSS?: () => CSSProperties;
  onHoverCSS?: () => CSSProperties;
};

export const Button = ({ children, onFocusCSS, onHoverCSS, ...rest }: ButtonProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const onFocusStyle: CSSProperties = isFocused && onFocusCSS ? onFocusCSS() : {};
  const onHoverStyle: CSSProperties = isHovered && onHoverCSS ? onHoverCSS() : {};

  return (
    <button
      {...rest}
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
      }}
    >
      {children}
    </button>
  );
};