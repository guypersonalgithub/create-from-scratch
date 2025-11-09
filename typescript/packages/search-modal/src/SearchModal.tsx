import { Button } from "@packages/button";
import { useControlModal } from "@packages/modal";
import { MagnifyingGlass } from "@packages/icons";
import { Badge } from "@packages/badge";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { Input } from "@packages/input";
import { Key } from "@packages/keyboard-key";
import { type PickOptionArgs, type SearchModalOption, type SearchModalProps } from "./types";
import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { DisplayableOptions } from "./DisplayableOptions";

export const SearchModal = ({
  buttonClassName,
  buttonStyle,
  badgeClassName,
  badgeStyle,
  modalClassName,
  modalStyle,
  optionClassName,
  optionStyle,
  highlightedOptionClassName,
  highlightedOptionStyle,
  footerClassName,
  footerStyle,
  isMinimized,
  minimizedClassName,
  minimizedStyle,
  options,
  onPickCallback,
}: SearchModalProps) => {
  const { openModal, closeModal } = useControlModal();
  const isModalOpen = useRef(false);
  const onCloseModal = () => {
    isModalOpen.current = false;
    closeModal();
  };

  const openModalCallback = () => {
    openModal({
      content: (
        <Modal
          className={modalClassName}
          style={modalStyle}
          optionsClassName={optionClassName}
          optionStyle={optionStyle}
          highlightedOptionsClassName={highlightedOptionClassName}
          highlightedOptionStyle={highlightedOptionStyle}
          footerClassName={footerClassName}
          footerStyle={footerStyle}
          closeModal={onCloseModal}
          options={options}
          onPickCallback={onPickCallback}
        />
      ),
      className: dynatic`
        bottom: 0;
      `,
    });

    isModalOpen.current = true;
  };

  useEffect(() => {
    if (isModalOpen.current) {
      openModalCallback();
    }
  }, []);

  useEffect(() => {
    const openPageSearchModal = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        event.stopPropagation();
        openModalCallback();
      } else if (isModalOpen.current && event.key === "Escape") {
        onCloseModal();
      }
    };

    window.addEventListener("keydown", openPageSearchModal);

    return () => {
      window.removeEventListener("keydown", openPageSearchModal);
    };
  }, []);

  if (isMinimized) {
    return (
      <Button
        className={combineStringsWithSpaces(
          dynatic`
            border: none;
            background: none;
            cursor: pointer;
            padding: 0;
          `,
          minimizedClassName,
        )}
        style={minimizedStyle}
        onClick={openModalCallback}
      >
        <MagnifyingGlass
          className={dynatic`
            width: 20px;
            height: 20px;
          `}
        />
      </Button>
    );
  }

  return (
    <div>
      <Button
        className={combineStringsWithSpaces(
          dynatic`
            border: 1px solid #dadada;
            border-radius: 10px;
            display: flex;
            gap: 10px;
            justify-content: space-between;
            height: 42px;
            color: #99989d;
            align-items: center;
            cursor: pointer;
          `,
          buttonClassName,
        )}
        style={buttonStyle}
        onClick={openModalCallback}
      >
        <div
          className={dynatic`
            display: flex;
            gap: 10px;
            align-items: center;
          `}
        >
          <MagnifyingGlass
            className={dynatic`
              width: 20px;
              height: 20px;
            `}
          />
          <div>Search</div>
        </div>
        <Badge
          variant="ghost"
          size="md"
          className={combineStringsWithSpaces(
            dynatic`
              color: #99989d;
              height: fit-content;
              cursor: pointer;
            `,
            badgeClassName,
          )}
          style={badgeStyle}
        >
          <Key>Ctrl</Key>+<Key>K</Key>
        </Badge>
      </Button>
    </div>
  );
};

type ModalProps = {
  className?: string;
  style?: CSSProperties;
  optionsClassName?: string;
  optionStyle?: CSSProperties;
  highlightedOptionsClassName?: string;
  highlightedOptionStyle?: CSSProperties;
  footerClassName?: string;
  footerStyle?: CSSProperties;
  closeModal: () => void;
  options: SearchModalOption[];
  onPickCallback: (arg: { value: string }) => void;
};

const Modal = ({
  className,
  style,
  optionsClassName,
  optionStyle,
  highlightedOptionsClassName,
  highlightedOptionStyle,
  footerClassName,
  footerStyle,
  closeModal,
  options,
  onPickCallback,
}: ModalProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const optionContainerRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [filter, setFilter] = useState("");
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const filterExists = filter.length > 0;
  const lowercaseFilter = filter.toLowerCase();

  useEffect(() => {
    const timeout = setTimeout(() => {
      ref.current?.focus();
    }, 50); // The modal initially has an opacity 0 when mounting due to its default animation, browsers tend to ignore focus calls entirely when attempting to focus on an invisible inputs.

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const displayableOptions = options.filter(
    (option) =>
      option.label.toLowerCase().includes(lowercaseFilter) ||
      option.description?.toLowerCase().includes(lowercaseFilter),
  );

  const pickOption = ({ value }: PickOptionArgs) => {
    onPickCallback({ value });
    closeModal();
  };

  const footerKeyWrapperClassName = dynatic`
    display: flex;
    gap: 10px;
    align-items: center;
  `;

  return (
    <div
      className={combineStringsWithSpaces(
        dynatic`
          background-color: white;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 600px;

          ${(config) => config.utils.widthMediaQuery({ to: "1000px" })} {
            width: 90vw;
          }
        `,
        filterExists
          ? dynatic`
              height: 400px;
            `
          : dynatic`
              height: 200px;
            `,
        className,
      )}
      style={style}
    >
      <div
        className={dynatic`
          padding: 10px;
        `}
      >
        <Input
          externalRef={ref}
          className={dynatic`
            font-size: 20px;
          `}
          wrapperClassName={dynatic`
            height: 60px;
            border-radius: 5px;  
          `}
          value={filter}
          onChange={(e) => {
            optionRefs.current = [];
            setFilter(e.target.value);
            setFocusedIndex(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const option = displayableOptions[focusedIndex];
              const { value } = option;
              pickOption({ value });
            } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
              e.preventDefault();

              setFocusedIndex((prev) => {
                let nextIndex = prev;

                if (e.key === "ArrowDown") {
                  nextIndex = prev === displayableOptions.length - 1 ? 0 : prev + 1;
                } else if (e.key === "ArrowUp") {
                  nextIndex = prev === 0 ? displayableOptions.length - 1 : prev - 1;
                }

                const option = optionRefs.current[nextIndex];
                if (option) {
                  option.scrollIntoView({ block: "nearest" });
                }

                return nextIndex;
              });
            }
          }}
          placeholder="Search docs"
        />
      </div>
      <div
        ref={optionContainerRef}
        className={dynatic`
          height: 100%;
          padding-left: 10px;
          padding-right: 10px;
          overflow: auto;
          display: flex;
          flex-direction: column;
          position: relative;
          gap: 5px;
        `}
      >
        {filterExists ? (
          <DisplayableOptions
            displayableOptions={displayableOptions}
            focusedIndex={focusedIndex}
            optionRefs={optionRefs}
            optionClassName={optionsClassName}
            optionStyle={optionStyle}
            highlightedOptionClassName={highlightedOptionsClassName}
            highlightedOptionStyle={highlightedOptionStyle}
            setFocusedIndex={setFocusedIndex}
            pickOption={pickOption}
          />
        ) : (
          <div>Start typing to see results.</div>
        )}
      </div>
      <div
        className={combineStringsWithSpaces(
          dynatic`
            border-top: 3px solid black;
            padding-top: 5px;
            display: flex;
            gap: 10px;
            padding-bottom: 10px;
            padding-left: 10px;
            color: #99989d;
          `,
          footerClassName,
        )}
        style={footerStyle}
      >
        <div className={footerKeyWrapperClassName}>
          <Key>Enter ↩︎</Key>
          <div>to select</div>
        </div>
        <div className={footerKeyWrapperClassName}>
          <div>
            <Key>↑</Key>
            <Key>↓</Key>
          </div>
          <div>to navigate</div>
        </div>
        <div className={footerKeyWrapperClassName}>
          <Key>Esc</Key>
          <div>to close</div>
        </div>
      </div>
    </div>
  );
};
