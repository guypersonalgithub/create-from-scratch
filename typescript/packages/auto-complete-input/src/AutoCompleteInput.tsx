import { BaseTypeaheadOption, Typeahead } from "@packages/typeahead";
import { useDebounce } from "@packages/hooks";
import { MagnifyingGlass } from "@packages/icons";
import { CSSProperties, useEffect, useState } from "react";

type AutoCompleteInputProps<T extends BaseTypeaheadOption> = {
  debounceDelay?: number;
  autocompleteOptionsCallback: (text: string) => T[];
  callback: (text: T) => void;
  isLoading?: boolean;
  inputWrapperStyle?: CSSProperties;
};

export const AutoCompleteInput = <T extends BaseTypeaheadOption>({
  debounceDelay,
  autocompleteOptionsCallback,
  callback,
  isLoading,
  inputWrapperStyle,
}: AutoCompleteInputProps<T>) => {
  const [options, setOptions] = useState<T[]>([]);
  const [innerIsLoading, setInnerIsLoading] = useState(false);
  const { set, clear } = useDebounce();

  useEffect(() => {
    return () => {
      clear();
    };
  }, []);

  const updateOptions = ({ text }: { text: string }) => {
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

        if (!debounceDelay) {
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
    />
  );
};
