import { useState, useRef, KeyboardEvent, Fragment } from "react";
import { useClickOutside } from "./hooks";
import { Input } from "@packages/input";
import { VaryingVirtualList } from "@packages/virtual-list";

type TypeaheadProperties<T extends { label: string; value: string }> = {
  options: T[];
  callback: (pick: string) => void;
  disabled?: boolean;
  className?: string;
  withSeperators?: boolean;
  initialValue?: string;
};

export const Typeahead = <T extends { label: string; value: string }>({
  options,
  callback,
  disabled,
  className,
  withSeperators,
  initialValue = "",
}: TypeaheadProperties<T>) => {
  const [filter, setFilter] = useState<string>(initialValue);
  const [results, setResults] = useState<{ label: string; value: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | undefined>(undefined);
  const typeaheadContainerRef = useRef<HTMLDivElement>(null);

  useClickOutside({
    ref: [typeaheadContainerRef.current],
    onClick: () => {
      setResults([]);
    },
    isActive: results.length > 0,
  });

  const filterResults = ({
    keyword,
    options,
  }: {
    keyword: string;
    options: { label: string; value: string }[];
  }) => {
    const searchResults = [];
    for (let i = 0; i < options.length; i++) {
      const itemName = options[i].label.toLowerCase();
      const keywordName = keyword.toLowerCase();
      if (itemName.includes(keywordName)) {
        searchResults.push(options[i]);
      }
    }

    if (keyword.length > 0 && searchResults.length === 0) {
      return [{ label: "Results not found", value: "" }];
    }

    return searchResults;
  };

  const onInputChange = (value: string) => {
    setFilter(value);
    setResults([]);

    if (value.length >= 0) {
      const newResults = filterResults({
        keyword: value,
        options,
      });
      setResults(newResults);
      const somethingEqualsInput = newResults.findIndex((option) => option.label === value);
      setCurrentIndex(somethingEqualsInput);
    }
  };

  const onNameSelected = ({ selectedName }: { selectedName: string }) => {
    callback(selectedName);
    setFilter(selectedName);
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

        onNameSelected({ selectedName: options[currentIndex].label });
      }
    } else if (e.key === "Escape") {
      setResults([]);
    }
  };

  const onResultClick = ({ result }: { result: { label: string; value: string } }) => {
    if (result.label !== "Results not found") {
      onNameSelected({ selectedName: result.label });
    }
  };

  return (
    <div
      ref={typeaheadContainerRef}
      style={{ position: "relative", height: "fit-content", width: "100%" }}
    >
      <Input
        style={{ width: "100%", textAlign: "center" }}
        className="focus:outline-none"
        externalState={{
          value: filter,
          onChange: onInputChange,
        }}
        onKeyDown={handleKeyDown}
        value={filter}
        onClick={() => {
          setResults(
            filterResults({
              keyword: filter,
              options,
            }),
          );
        }}
        onFocus={() => {
          setResults(
            filterResults({
              keyword: filter,
              options,
            }),
          );
        }}
        disabled={disabled}
      />
      <div
        style={{
          position: "absolute",
          backgroundColor: "white",
          ...(results.length > 0
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
        <VaryingVirtualList containerHeight={150}>
          {results.length > 0
            ? results.map((result: { label: string; value: string }, index: number) => {
                return (
                  <Fragment key={`${result.label}-${index}`}>
                    <div
                      style={{
                        zIndex: 20,
                        cursor: "pointer",
                        backgroundColor:
                          index === currentIndex || index === hoveredIndex ? "#e6e6e6" : "white",
                        padding: "8px",
                        fontWeight: "bold",
                      }}
                      className={`justify-around hover:bg-primary hover:text-white`}
                      onClick={() => onResultClick({ result })}
                      onMouseEnter={() => setHoveredIndex(index)}
                    >
                      {result.label}
                    </div>
                    {withSeperators ? (
                      <hr
                        style={{
                          marginTop: "4px",
                          marginBottom: "4px",
                          height: "1px",
                          width: "100%",
                        }}
                        className="bg-primary"
                      />
                    ) : null}
                  </Fragment>
                );
              })
            : []}
        </VaryingVirtualList>
        {/* {results.length > 0
          ? results.map((result: { label: string; value: string }, index: number) => {
              return (
                <Fragment key={`${result.label}-${index}`}>
                  <div
                    style={{
                      zIndex: 20,
                      cursor: "pointer",
                      backgroundColor:
                        index === currentIndex || index === hoveredIndex ? "#e6e6e6" : "white",
                      padding: "8px",
                      fontWeight: "bold",
                    }}
                    className={`justify-around hover:bg-primary hover:text-white`}
                    onClick={() => onResultClick({ result })}
                    onMouseEnter={() => setHoveredIndex(index)}
                  >
                    {result.label}
                  </div>
                  {withSeperators ? (
                    <hr
                      style={{
                        marginTop: "4px",
                        marginBottom: "4px",
                        height: "1px",
                        width: "100%",
                      }}
                      className="bg-primary"
                    />
                  ) : null}
                </Fragment>
              );
            })
          : null} */}
      </div>
    </div>
  );
};
