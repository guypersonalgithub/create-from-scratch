import { Button } from "@packages/button";
import { useControlModal } from "@packages/modal";
import { EmptyFolder, MagnifyingGlass } from "@packages/icons";
import { Badge } from "@packages/badge";
import {
  CSSProperties,
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Input } from "@packages/input";
import { Key } from "@packages/keyboard-key";
import { SearchModalOption } from "./types";

type SearchModalProps = {
  buttonStyle?: CSSProperties;
  badgeStyle?: CSSProperties;
  modalStyle?: CSSProperties;
  optionStyle?: CSSProperties;
  highlightedOptionStyle?: CSSProperties;
  footerStyle?: CSSProperties;
  isDesktop: boolean;
  mobileButtonStyle?: CSSProperties;
  options: SearchModalOption[];
  onPickCallback: (arg: { value: string }) => void;
};

export const SearchModal = ({
  buttonStyle,
  badgeStyle,
  modalStyle,
  optionStyle,
  highlightedOptionStyle,
  footerStyle,
  isDesktop,
  mobileButtonStyle,
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
          style={modalStyle}
          optionStyle={optionStyle}
          highlightedOptionStyle={highlightedOptionStyle}
          footerStyle={footerStyle}
          closeModal={onCloseModal}
          isDesktop={isDesktop}
          options={options}
          onPickCallback={onPickCallback}
        />
      ),
      style: {
        bottom: 0,
      },
    });

    isModalOpen.current = true;
  };

  useEffect(() => {
    if (isModalOpen.current) {
      openModalCallback();
    }
  }, [isDesktop]);

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
  }, [isDesktop]);

  if (!isDesktop) {
    return (
      <Button
        style={{
          border: "none",
          background: "none",
          cursor: "pointer",
          padding: 0,
          ...mobileButtonStyle,
        }}
        onClick={openModalCallback}
      >
        <MagnifyingGlass size={20} />
      </Button>
    );
  }

  return (
    <div>
      <Button
        style={{
          border: "1px solid #dadada",
          borderRadius: "10px",
          display: "flex",
          gap: "10px",
          justifyContent: "space-between",
          height: "42px",
          color: "#99989d",
          alignItems: "center",
          cursor: "pointer",
          ...buttonStyle,
        }}
        onClick={openModalCallback}
      >
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <MagnifyingGlass size={20} />
          <div>Search</div>
        </div>
        <Badge
          variant="ghost"
          size="md"
          style={{ color: "#99989d", height: "fit-content", cursor: "pointer", ...badgeStyle }}
        >
          <Key>Ctrl</Key>+<Key>K</Key>
        </Badge>
      </Button>
    </div>
  );
};

type ModalProps = {
  style?: CSSProperties;
  optionStyle?: CSSProperties;
  highlightedOptionStyle?: CSSProperties;
  footerStyle?: CSSProperties;
  closeModal: () => void;
  isDesktop: boolean;
  options: SearchModalOption[];
  onPickCallback: (arg: { value: string }) => void;
};

type PickOptionArgs = {
  value: string;
};

const Modal = ({
  style,
  optionStyle,
  highlightedOptionStyle,
  footerStyle,
  closeModal,
  isDesktop,
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

  return (
    <div
      style={{
        width: isDesktop ? "600px" : "90vw",
        height: filterExists ? "400px" : "200px",
        backgroundColor: "white",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        ...style,
      }}
    >
      <div style={{ padding: "10px" }}>
        <Input
          externalRef={ref}
          wrapperStyle={{ height: "60px", borderRadius: "5px" }}
          style={{ fontSize: "20px" }}
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
        style={{
          height: "100%",
          paddingLeft: "10px",
          paddingRight: "10px",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          gap: "5px",
        }}
      >
        {filterExists ? (
          <DisplayableOptions
            displayableOptions={displayableOptions}
            focusedIndex={focusedIndex}
            optionRefs={optionRefs}
            optionStyle={optionStyle}
            highlightedOptionStyle={highlightedOptionStyle}
            setFocusedIndex={setFocusedIndex}
            pickOption={pickOption}
          />
        ) : (
          <div>Start typing to see results.</div>
        )}
      </div>
      <div
        style={{
          borderTop: "3px solid black",
          paddingTop: "5px",
          display: "flex",
          gap: "10px",
          paddingBottom: "10px",
          paddingLeft: "10px",
          color: "#99989d",
          ...footerStyle,
        }}
      >
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Key>Enter ↩︎</Key>
          <div>to select</div>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div>
            <Key>↑</Key>
            <Key>↓</Key>
          </div>
          <div>to navigate</div>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Key>Esc</Key>
          <div>to close</div>
        </div>
      </div>
    </div>
  );
};

type DisplayableOptionsProps = {
  displayableOptions: SearchModalOption[];
  focusedIndex: number;
  optionRefs: RefObject<(HTMLDivElement | null)[]>;
  optionStyle?: CSSProperties;
  highlightedOptionStyle?: CSSProperties;
  setFocusedIndex: Dispatch<SetStateAction<number>>;
  pickOption: ({ value }: PickOptionArgs) => void;
};

const DisplayableOptions = ({
  displayableOptions,
  focusedIndex,
  optionRefs,
  optionStyle,
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
        style={{
          cursor: "pointer",
          // transition: "background-color 0.3s ease-in",
          height: "60px",
          display: "flex",
          alignItems: "center",
          paddingLeft: "10px",
          paddingRight: "10px",
          fontWeight: "bold",
          borderRadius: "10px",
          justifyContent: "space-between",
          flexShrink: 0,
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
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <EmptyFolder size={26} />
          <div>
            <div>{label}</div>
            <div style={{ fontSize: "12px" }}>{description}</div>
          </div>
        </div>
        {isHighlighted ? <div>↩︎</div> : null}
      </div>
    );
  });
};
