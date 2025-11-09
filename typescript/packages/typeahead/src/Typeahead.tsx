import {
  useState,
  useRef,
  type KeyboardEvent,
  Fragment,
  useEffect,
  type ReactNode,
  type CSSProperties,
  useLayoutEffect,
} from "react";
import { useClickOutside } from "@packages/hooks";
import { Input } from "@packages/input";
import { VirtualList } from "@packages/virtual-list";
import { type BaseTypeaheadOption } from "./types";
import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";

export type TypeaheadProperties<T extends BaseTypeaheadOption> = {
  options: T[];
  disabled?: boolean;
  className?: string;
  withSeperators?: boolean;
  initialValue?: string;
  filterOnInitialOpening?: boolean;
  callback: (pick: T) => void;
  inputChangeCallback?: (pick: string) => void;
  isLoading?: boolean;
  customInputPrefix?: ReactNode;
  customInputSuffix?: ReactNode;
  inputWrapperClassName?: string;
  inputWrapperStyle?: CSSProperties;
  inputPlaceholder?: string;
  optionContainerClassName?: (args: { isSelected: boolean; isHovered: boolean }) => string;
  optionContainerStyle?: (args: { isSelected: boolean; isHovered: boolean }) => CSSProperties;
  optionContent?: (args: { result: T }) => ReactNode;
  clearInputOnPick?: boolean;
};

const ResultsNotFound = "Results not found";

export const Typeahead = <T extends BaseTypeaheadOption>({
  options,
  callback,
  inputChangeCallback,
  disabled,
  className,
  withSeperators,
  initialValue = "",
  filterOnInitialOpening = true,
  isLoading,
  customInputPrefix,
  customInputSuffix,
  inputWrapperClassName,
  inputWrapperStyle,
  inputPlaceholder,
  optionContainerClassName,
  optionContainerStyle,
  optionContent,
  clearInputOnPick,
}: TypeaheadProperties<T>) => {
  const [filter, setFilter] = useState<string>(initialValue);
  const [results, setResults] = useState<T[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | undefined>(undefined);
  const typeaheadContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFilter(initialValue);
  }, [initialValue]);

  useClickOutside({
    ref: [typeaheadContainerRef.current],
    onClick: () => {
      setResults([]);
    },
    isActive: results.length > 0,
  });

  const filterResults = ({ keyword, options }: { keyword: string; options: T[] }) => {
    const searchResults: T[] = [];
    for (let i = 0; i < options.length; i++) {
      const itemName = options[i].label.toLowerCase();
      const keywordName = keyword.toLowerCase();
      if (itemName.includes(keywordName)) {
        searchResults.push(options[i]);
      }
    }

    if (keyword.length > 0 && searchResults.length === 0) {
      return [{ label: ResultsNotFound, value: "" } as T];
    }

    return searchResults;
  };

  useLayoutEffect(() => {
    if (!inputChangeCallback || options.length === 0) {
      return;
    }

    const newResults = filterResults({
      keyword: filter,
      options,
    });

    setResults(newResults);
  }, [options, inputChangeCallback]);

  const onInputChange = (value: string) => {
    setFilter(value);
    setResults([]);

    if (inputChangeCallback) {
      inputChangeCallback(value);

      return;
    }

    const newResults = filterResults({
      keyword: value,
      options,
    });
    setResults(newResults);
    const someOptionHasTheSameLabel = newResults.findIndex((option) => option.label === value);
    setCurrentIndex(someOptionHasTheSameLabel);
  };

  const onNameSelected = ({ selected }: { selected: T }) => {
    callback(selected);
    setFilter(!clearInputOnPick ? selected.label : "");
    setResults([]);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === "Escape") {
      e.preventDefault();
    }

    if (e.key === "ArrowDown") {
      if (currentIndex < options.length - 1) {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }
    } else if (e.key === "ArrowUp") {
      if (currentIndex > 0) {
        setCurrentIndex((prevIndex) => prevIndex - 1);
      }
    } else if (e.key === "Enter") {
      if (options.length > 0) {
        if (currentIndex === -1) {
          return;
        }

        onNameSelected({ selected: options[currentIndex] });
      }
    } else if (e.key === "Escape") {
      setResults([]);
    }
  };

  const onResultClick = ({ result }: { result: T }) => {
    if (result.label === ResultsNotFound) {
      return;
    }

    onNameSelected({ selected: result });
  };

  return (
    <div
      ref={typeaheadContainerRef}
      className={dynatic`
        position: relative;
        height: fit-content;
        width: 100%;
      `}
    >
      <Input
        className={dynatic`
          width: 100%;
          text-align: center;
        `}
        externalState={{
          value: filter,
          onChange: onInputChange,
        }}
        onKeyDown={handleKeyDown}
        value={filter}
        onClick={() => {
          setResults(
            filterOnInitialOpening
              ? options
              : filterResults({
                  keyword: filter,
                  options,
                }),
          );
        }}
        onFocus={() => {
          setResults(
            filterOnInitialOpening
              ? options
              : filterResults({
                  keyword: filter,
                  options,
                }),
          );
        }}
        disabled={disabled}
        isLoading={isLoading}
        customPrefix={customInputPrefix}
        customSuffix={customInputSuffix}
        wrapperClassName={inputWrapperClassName}
        wrapperStyle={inputWrapperStyle}
        placeholder={inputPlaceholder}
      />
      <div
        className={combineStringsWithSpaces(
          dynatic`
            position: absolute;
            background-color: white;
          `,
          results.length > 0
            ? dynatic`
            z-index: 30;
            height: fit-content;
            maxHeight: 150px;
            width: 100%;
            overflow-y: auto;
          `
            : dynatic`
            z-index: 0;
            height: 0;
          `,
          className,
        )}
        onMouseLeave={() => setHoveredIndex(undefined)}
      >
        {results.length > 0 ? (
          <VirtualList
            containerHeight={150}
            itemHeight={40}
            className={dynatic`
              background-color: rgba(20, 12, 12);
            `}
          >
            {results.map((result: T, index: number) => {
              const isSelected = index === currentIndex;
              const isHovered = index === hoveredIndex;

              return (
                <Fragment key={`${result.label}-${index}`}>
                  <div
                    className={combineStringsWithSpaces(
                      dynatic`
                      z-index: 20;
                      padding: 8px;
                      font-weight: bold;
                      color: white;
                    `,
                      result.label !== ResultsNotFound
                        ? dynatic`
                      cursor: pointer;
                    `
                        : dynatic`
                      cursor: default;
                    `,
                      isSelected || isHovered
                        ? dynatic`
                      background-color: black;
                    `
                        : dynatic`
                      background-color: rgba(20, 12, 12);
                    `,
                      optionContainerClassName?.({ isSelected, isHovered }),
                    )}
                    style={optionContainerStyle?.({ isSelected, isHovered })}
                    onClick={() => onResultClick({ result })}
                    onMouseEnter={() => setHoveredIndex(index)}
                  >
                    {optionContent ? optionContent({ result }) : result.label}
                  </div>
                  {withSeperators ? (
                    <hr
                      className={dynatic`
                        margin-top: 4px;
                        margin-bottom: 4px;
                        height: 1px;
                        width: 100%;
                      `}
                    />
                  ) : null}
                </Fragment>
              );
            })}
          </VirtualList>
        ) : null}
      </div>
    </div>
  );
};
