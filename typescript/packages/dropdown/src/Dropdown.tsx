import {
  useState,
  useRef,
  type KeyboardEvent,
  Fragment,
  type ReactNode,
  type CSSProperties,
} from "react";
import { useClickOutside } from "@packages/hooks";
import { Input } from "@packages/input";
import { VirtualList } from "@packages/virtual-list";
import { type BaseDropdownOption } from "./types";
import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";

type DropdownProps<T extends BaseDropdownOption> = {
  options: T[];
  disabled?: boolean;
  className?: string;
  withSeperators?: boolean;
  initialValue?: string;
  callback: (pick: T) => void;
  isLoading?: boolean;
  customInputPrefix?: ReactNode;
  customInputSuffix?: ReactNode;
  inputWrapperClassName?: string;
  inputWrapperStyle?: CSSProperties;
  inputPlaceholder?: string;
  optionContainerClassName?: (args: { isSelected: boolean; isHovered: boolean }) => string;
  optionContainerStyle?: (args: { isSelected: boolean; isHovered: boolean }) => CSSProperties;
  optionContent?: (args: { option: T }) => ReactNode;
};

export const Dropdown = <T extends BaseDropdownOption>({
  options,
  disabled,
  className,
  withSeperators,
  initialValue = "",
  callback,
  isLoading,
  customInputPrefix,
  customInputSuffix,
  inputWrapperClassName,
  inputWrapperStyle,
  inputPlaceholder,
  optionContainerClassName,
  optionContainerStyle,
  optionContent,
}: DropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [picked, setPicked] = useState<string>(initialValue);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | undefined>(undefined);
  const typeaheadContainerRef = useRef<HTMLDivElement>(null);

  useClickOutside({
    ref: [typeaheadContainerRef.current],
    onClick: () => setIsOpen(false),
    isActive: isOpen,
  });

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

        onResultClick({ option: options[currentIndex] });
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const onResultClick = ({ option }: { option: T }) => {
    callback(option);
    setPicked(option.label);
    setIsOpen(false);
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
          cursor: pointer;
        `}
        onKeyDown={handleKeyDown}
        value={picked}
        onClick={() => setIsOpen(true)}
        onFocus={() => setIsOpen(true)}
        disabled={disabled}
        isLoading={isLoading}
        customPrefix={customInputPrefix}
        customSuffix={customInputSuffix}
        wrapperClassName={inputWrapperClassName}
        wrapperStyle={inputWrapperStyle}
        placeholder={inputPlaceholder}
        readOnly
      />
      <div
        className={combineStringsWithSpaces(
          dynatic`
            position: absolute;
            background-color: white;
          `,
          isOpen
            ? dynatic`
                z-index: 30;
                height: fit-content;
                max-height: 150px;
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
        {isOpen ? (
          <VirtualList
            containerHeight={150}
            itemHeight={40}
            className={dynatic`
              background-color: rgba(20, 12, 12);
            `}
          >
            {options.map((option: T, index: number) => {
              const isSelected = index === currentIndex;
              const isHovered = index === hoveredIndex;

              return (
                <Fragment key={`${option.label}-${index}`}>
                  <div
                    className={combineStringsWithSpaces(
                      dynatic`
                        z-index: 20;
                        cursor: pointer;
                        padding: 8px;
                        font-weight: bold;
                        color: white;
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
                    onClick={() => onResultClick({ option })}
                    onMouseEnter={() => setHoveredIndex(index)}
                  >
                    {optionContent ? optionContent({ option }) : option.label}
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
