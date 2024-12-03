import {
  useState,
  useRef,
  KeyboardEvent,
  Fragment,
  ReactNode,
  CSSProperties,
} from "react";
import { useClickOutside } from "@packages/hooks";
import { Input } from "@packages/input";
import { VirtualList } from "@packages/virtual-list";
import { BaseDropdownOption } from "./types";

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
  inputWrapperStyle?: CSSProperties;
  inputPlaceholder?: string;
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
  inputWrapperStyle,
  inputPlaceholder,
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
      style={{ position: "relative", height: "fit-content", width: "100%" }}
    >
      <Input
        style={{ width: "100%", textAlign: "center", cursor: "pointer" }}
        onKeyDown={handleKeyDown}
        value={picked}
        onClick={() => setIsOpen(true)}
        onFocus={() => setIsOpen(true)}
        disabled={disabled}
        isLoading={isLoading}
        customPrefix={customInputPrefix}
        customSuffix={customInputSuffix}
        wrapperStyle={inputWrapperStyle}
        placeholder={inputPlaceholder}
        readOnly
      />
      <div
        style={{
          position: "absolute",
          backgroundColor: "white",
          ...(isOpen
            ? {
                zIndex: 30,
                height: "fit-content",
                maxHeight: "150px",
                width: "100%",
                overflowY: "auto",
              }
            : { zIndex: 0, height: 0 }),
        }}
        className={className}
        onMouseLeave={() => setHoveredIndex(undefined)}
      >
        {isOpen ? (
          <VirtualList containerHeight={150} itemHeight={40} backgroundColor="rgba(20, 12, 12)">
            {options.map((option: T, index: number) => {
              return (
                <Fragment key={`${option.label}-${index}`}>
                  <div
                    style={{
                      zIndex: 20,
                      cursor: "pointer",
                      backgroundColor:
                        index === currentIndex || index === hoveredIndex
                          ? "black"
                          : "rgba(20, 12, 12)",
                      padding: "8px",
                      fontWeight: "bold",
                      color: "white",
                    }}
                    onClick={() => onResultClick({ option })}
                    onMouseEnter={() => setHoveredIndex(index)}
                  >
                    {option.label}
                  </div>
                  {withSeperators ? (
                    <hr
                      style={{
                        marginTop: "4px",
                        marginBottom: "4px",
                        height: "1px",
                        width: "100%",
                      }}
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
