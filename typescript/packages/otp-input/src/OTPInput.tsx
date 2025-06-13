import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { isCharsAndDigitsOnly } from "@packages/regex";
import { Input } from "@packages/input";
import { Button, type ButtonProps } from "@packages/button";

type OTPInputProps<T extends "text" | "number", G extends T extends "text" ? string : number> = {
  style?: CSSProperties;
  inputStyle?: CSSProperties;
  type: T;
  count: number;
  callback: (args: { value: G }) => void;
  autoTrigger?: boolean;
} & (DisplayButton | NoButton);

type DisplayButton = Omit<ButtonProps, "style" | "type"> & {
  displayButton?: boolean;
  buttonStyle?: CSSProperties;
  buttonContent?: ReactNode;
};

type NoButton = {
  displayButton?: never;
  buttonStyle?: never;
  buttonContent?: never;
};

export const OTPInput = <
  T extends "text" | "number",
  G extends T extends "text" ? string : number,
>({
  style,
  inputStyle,
  type,
  count,
  callback,
  autoTrigger,
  displayButton,
  buttonStyle,
  buttonContent = "Submit",
  ...rest
}: OTPInputProps<T, G>) => {
  const array = Array.from({ length: count }).map(() => "");
  const [value, setValue] = useState(array);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setValue(array);
  }, [count]);

  useEffect(() => {
    const amountOfFilledInputs = value.filter(Boolean);

    if (autoTrigger && amountOfFilledInputs.length === count) {
      callback({ value: value.join("") as G });
    }
  }, [autoTrigger, value]);

  return (
    <div>
      <div style={{ display: "flex", ...style }}>
        {array.map((_, index) => {
          return (
            <Input
              externalRef={(el) => {
                inputRefs.current[index] = el;
              }}
              key={index}
              style={inputStyle}
              type={type}
              required={true}
              maxLength={1}
              value={value[index]}
              onChange={(event) => {
                const value = event.target.value;

                setValue((prev) => {
                  const clone = prev.slice();
                  clone[index] = value;

                  return clone;
                });

                if (value.length === 0) {
                  return;
                }

                inputRefs.current?.[index + 1]?.focus();
              }}
              onKeyDown={(event) => {
                if (event.ctrlKey) {
                  return;
                }

                const key = event.key;

                const target = event.target as HTMLInputElement;
                const value = event.currentTarget.value;
                const cursorAtStart = target.selectionStart === 0;
                const cursorAtEnd = target.selectionEnd === value.length;

                if (key === "Backspace") {
                  event.preventDefault();

                  if (value.length > 0 && (!cursorAtStart || (cursorAtStart && cursorAtEnd))) {
                    setValue((prev) => {
                      const clone = [...prev];
                      clone[index] = "";

                      return clone;
                    });
                  }

                  if (index > 0) {
                    inputRefs.current?.[index - 1]?.focus();
                  }
                }

                const isValidValue = isCharsAndDigitsOnly({ str: key });

                if (!isValidValue) {
                  return;
                }

                if (cursorAtStart) {
                  event.preventDefault();

                  setValue((prev) => {
                    const clone = [...prev];
                    clone[index] = key;

                    return clone;
                  });

                  if (index < array.length - 1) {
                    inputRefs.current?.[index + 1]?.focus();
                  }
                }
              }}
              onPaste={(event) => {
                event.preventDefault();
                const pasted = event.clipboardData.getData("text").trim();
                const chars = pasted.split("").slice(0, count - index);

                setValue((prev) => {
                  const clone = [...prev];
                  chars.forEach((char, i) => {
                    clone[index + i] = char;
                    //   inputRefs.current[i]?.value !== char && (inputRefs.current[i]!.value = char);
                  });

                  const next = chars.length < count ? chars.length : count - 1;
                  inputRefs.current[next]?.focus();

                  return clone;
                });
              }}
            />
          );
        })}
      </div>
      {displayButton ? (
        <Button
          {...rest}
          style={buttonStyle}
          onClick={() => {
            callback({ value: value.join("") as G });
          }}
        >
          {buttonContent}
        </Button>
      ) : null}
    </div>
  );
};
