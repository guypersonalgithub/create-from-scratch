import type { CSSProperties, Dispatch, RefObject, SetStateAction } from "react";
import type { PickOptionArgs, SearchModalOption } from "./types";
import { EmptyFolder } from "@packages/icons";
import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";

type DisplayableOptionsProps = {
  displayableOptions: SearchModalOption[];
  focusedIndex: number;
  optionRefs: RefObject<(HTMLDivElement | null)[]>;
  optionClassName?: string;
  optionStyle?: CSSProperties;
  highlightedOptionClassName?: string;
  highlightedOptionStyle?: CSSProperties;
  setFocusedIndex: Dispatch<SetStateAction<number>>;
  pickOption: ({ value }: PickOptionArgs) => void;
};

export const DisplayableOptions = ({
  displayableOptions,
  focusedIndex,
  optionRefs,
  optionClassName,
  optionStyle,
  highlightedOptionClassName,
  highlightedOptionStyle,
  setFocusedIndex,
  pickOption,
}: DisplayableOptionsProps) => {
  if (displayableOptions.length === 0) {
    return "No options were found for the inserted input.";
  }

  return displayableOptions.map((option, index) => {
    const { value, label, description } = option;

    const isHighlighted = focusedIndex === index;

    return (
      <div
        ref={(ref) => {
          optionRefs.current[index] = ref;
        }}
        key={value}
        className={combineStringsWithSpaces(
          dynatic`
            cursor: pointer;
            height: 60px;
            display: flex;
            align-items: center;
            padding-left: 10px;
            padding-right: 10px;
            font-weight: bold;
            border-radius: 10px;
            justify-content: space-between;
            flex-shrink: 0;
          `,
          optionClassName,
          isHighlighted && highlightedOptionClassName,
        )}
        style={{
          // transition: "background-color 0.3s ease-in",
          ...optionStyle,
          ...(isHighlighted ? highlightedOptionStyle : {}),
        }}
        onMouseEnter={() => {
          setFocusedIndex(index);
          // e.currentTarget.style.backgroundColor = "red";
        }}
        // onMouseLeave={(e) => {
        //   e.currentTarget.style.backgroundColor = "";
        // }}
        // onFocus={(e) => {
        //   e.currentTarget.style.outline = "1px solid red";
        // }}
        // onBlur={(e) => {
        //   e.currentTarget.style.outline = "none";
        // }}
        onClick={() => pickOption({ value })}
        // onKeyDown={(e) => {
        //   if (e.key === "Enter") {
        //     pickOption();
        //   } else if (e.key === "ArrowDown") {
        //     e.preventDefault();
        //     setFocusedIndex((prev) =>
        //       prev === options.length - 1 ? prev : (prev ?? -1) + 1,
        //     );
        //   } else if (e.key === "ArrowUp") {
        //     e.preventDefault();
        //     setFocusedIndex((prev) => (prev === 0 ? 0 : prev - 1));
        //   }
        // }}
        // tabIndex={-1}
      >
        <div
          className={dynatic`
            display: flex;
            align-items: center;
            gap: 6px;  
          `}
        >
          <EmptyFolder
            className={dynatic`
              height: 26px;
              width: 26px;
            `}
          />
          <div>
            <div>{label}</div>
            <div
              className={dynatic`
                font-size: 12px;  
              `}
            >
              {description}
            </div>
          </div>
        </div>
        {isHighlighted ? <div>↩︎</div> : null}
      </div>
    );
  });
};
