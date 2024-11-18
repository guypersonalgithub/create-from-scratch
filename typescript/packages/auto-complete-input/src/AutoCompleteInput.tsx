import { BaseTypeaheadOption, Typeahead } from "@packages/typeahead";
import { useDebounce } from "@packages/hooks";
import { MagnifyingGlass } from "@packages/icons";
import { CSSProperties, useEffect, useRef, useState } from "react";

type AutoCompleteInputProps<T extends BaseTypeaheadOption> = {
  debounceDelay?: number;
  autocompleteOptionsCallback: (text: string) => T[];
  callback: (text: T) => void;
  isLoading?: boolean;
  inputWrapperStyle?: CSSProperties;
  inputPlaceholder?: string;
};

export const AutoCompleteInput = <T extends BaseTypeaheadOption>({
  debounceDelay,
  autocompleteOptionsCallback,
  callback,
  isLoading,
  inputWrapperStyle,
  inputPlaceholder,
}: AutoCompleteInputProps<T>) => {
  const [options, setOptions] = useState<T[]>([]);
  const [innerIsLoading, setInnerIsLoading] = useState(false);
  const lastInput = useRef<string>("");
  const { set } = useDebounce();

  const updateOptions = ({ text }: { text: string }) => {
    lastInput.current = text;
    const options = autocompleteOptionsCallback(text);
    setOptions(options);
  };

  return (
    <Typeahead
      options={options}
      inputChangeCallback={(text) => {
        if (text.length === 0) {
          setOptions([]);
          return;
        }

        if (!debounceDelay || (lastInput.current.length > 0 && text.includes(lastInput.current))) {
          updateOptions({ text });
          return;
        }

        if (isLoading === undefined) {
          setInnerIsLoading(true);
        }

        set({
          callback: () => {
            updateOptions({ text });

            if (isLoading === undefined) {
              setInnerIsLoading(false);
            }
          },
          delay: debounceDelay,
        });
      }}
      callback={callback}
      isLoading={innerIsLoading}
      customInputPrefix={<MagnifyingGlass width={22} style={{ color: "black" }} />}
      inputWrapperStyle={inputWrapperStyle}
      inputPlaceholder={inputPlaceholder}
    />
  );
};
