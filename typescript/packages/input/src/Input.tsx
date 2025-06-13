import {
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
  useEffect,
  useState,
  type Ref,
} from "react";
import { Spinner } from "@packages/loading";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  externalState?: {
    value: string;
    onChange: (value: string) => void;
  };
  onFocusCSS?: () => CSSProperties;
  onHoverCSS?: () => CSSProperties;
  isLoading?: boolean;
  customPrefix?: ReactNode;
  customSuffix?: ReactNode;
  wrapperStyle?: CSSProperties;
  externalRef?: Ref<HTMLInputElement>;
};

export const Input = ({
  externalState,
  onFocusCSS,
  onHoverCSS,
  isLoading,
  customPrefix = null,
  customSuffix = null,
  wrapperStyle = {},
  externalRef,
  ...rest
}: InputProps) => {
  const [value, setValue] = useState<string>((rest.value as string) ?? "");
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const onFocusStyle: CSSProperties = isFocused && onFocusCSS ? onFocusCSS() : {};
  const onHoverStyle: CSSProperties = isHovered && onHoverCSS ? onHoverCSS() : {};

  useEffect(() => {
    setValue(rest.value as string);
  }, [rest.value]);

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "white",
        height: "20px",
        borderRadius: "20px",
        paddingLeft: "5px",
        paddingRight: "5px",
        border: "1px solid black",
        overflow: "hidden",
        ...wrapperStyle,
      }}
    >
      {customPrefix}
      <input
        {...rest}
        ref={externalRef}
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
          width: "100%",
          ...rest.style,
          ...(isFocused ? { outline: "none" } : {}),
          ...onFocusStyle,
          ...onHoverStyle,
          boxSizing: "border-box",
          border: 0,
        }}
      />
      {customSuffix}
      <Loading isLoading={isLoading} />
    </div>
  );
};

type LoadingProps = {
  isLoading?: boolean;
};

const Loading = ({ isLoading }: LoadingProps) => {
  if (isLoading === undefined) {
    return null;
  }

  return isLoading ? <Spinner size={15} /> : <div style={{ width: "19px", height: "19px" }} />;
};
