import {
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
  useEffect,
  useState,
  type Ref,
} from "react";
import { Spinner } from "@packages/loading";
import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  externalState?: {
    value: string;
    onChange: (value: string) => void;
  };
  isLoading?: boolean;
  customPrefix?: ReactNode;
  customSuffix?: ReactNode;
  wrapperClassName?: string;
  wrapperStyle?: CSSProperties;
  externalRef?: Ref<HTMLInputElement>;
};

export const Input = ({
  externalState,
  isLoading,
  customPrefix = null,
  customSuffix = null,
  wrapperClassName,
  wrapperStyle,
  externalRef,
  className,
  onChange,
  ...rest
}: InputProps) => {
  const [value, setValue] = useState<string>((rest.value as string) ?? "");

  useEffect(() => {
    setValue(rest.value as string);
  }, [rest.value]);

  return (
    <div
      className={combineStringsWithSpaces(
        dynatic`
          display: flex;
          background-color: white;
          height: 20px;
          border-radius: 20px;
          padding-left: 5px;
          padding-right: 5px;
          border: 1px solid black;
          overflow: hidden;
          align-items: center;
        `,
        wrapperClassName,
      )}
      style={wrapperStyle}
    >
      {customPrefix}
      <input
        {...rest}
        ref={externalRef}
        value={externalState?.value ?? value}
        onChange={(e) => {
          onChange?.(e);
          (externalState?.onChange ?? setValue)(e.target.value);
        }}
        className={combineStringsWithSpaces(
          dynatic`
            width: 100%;
            box-sizing: border-box;
            border: none;
            outline: none;
          `,
          className,
        )}
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

  return isLoading ? (
    <Spinner size={15} />
  ) : (
    <div
      className={dynatic`
      width: 19px;
      height: 19px;
    `}
    />
  );
};
