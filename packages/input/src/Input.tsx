import { CSSProperties, InputHTMLAttributes, useState } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  externalState?: {
    value: string;
    onChange: (value: string) => void;
  };
  onFocusCSS?: () => CSSProperties;
  onHoverCSS?: () => CSSProperties;
};

export const Input = ({ externalState, onFocusCSS, onHoverCSS, ...rest }: InputProps) => {
  const [value, setValue] = useState<string>((rest.value as string) ?? "");
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const onFocusStyle: CSSProperties = isFocused && onFocusCSS ? onFocusCSS() : {};
  const onHoverStyle: CSSProperties = isHovered && onHoverCSS ? onHoverCSS() : {};

  return (
    <input
      {...rest}
      value={externalState?.value ?? value}
      onChange={(e) => {
        rest.onChange?.(e);
        (externalState?.onChange ?? setValue)(e.target.value);
      }}
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
    />
  );
};
