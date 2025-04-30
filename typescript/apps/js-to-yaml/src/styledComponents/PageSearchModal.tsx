import { Button } from "@packages/button";
import { useControlModal } from "@packages/modal";
import { EmptyFolder, MagnifyingGlass } from "@packages/icons";
import { Badge } from "@packages/badge";
import {
  CSSProperties,
  Dispatch,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Input } from "@packages/input";
import { usePath } from "@packages/router";
import { Key } from "@packages/keyboard-key";

type PageSearchModalProps = {
  buttonStyle?: CSSProperties;
  badgeStyle?: CSSProperties;
  modalStyle?: CSSProperties;
  optionStyle?: CSSProperties;
  highlightedOptionStyle?: CSSProperties;
  footerStyle?: CSSProperties;
};

// TODO: turn into a package for potential reusability in other workspaces.

export const PageSearchModal = ({
  buttonStyle,
  badgeStyle,
  modalStyle,
  optionStyle,
  highlightedOptionStyle,
  footerStyle,
}: PageSearchModalProps) => {
  const { openModal, closeModal } = useControlModal();
  const isModalOpen = useRef(false);

  const openModalCallback = useCallback(() => {
    openModal({
      content: (
        <Modal
          style={modalStyle}
          optionStyle={optionStyle}
          highlightedOptionStyle={highlightedOptionStyle}
          footerStyle={footerStyle}
          closeModal={closeModal}
        />
      ),
    });

    isModalOpen.current = true;
  }, [modalStyle]);

  useEffect(() => {
    const openPageSearchModal = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        event.stopPropagation();
        openModalCallback();
      } else if (isModalOpen.current && event.key === "Escape") {
        closeModal();
        isModalOpen.current = false;
      }
    };

    window.addEventListener("keydown", openPageSearchModal);
    return () => {
      window.removeEventListener("keydown", openPageSearchModal);
    };
  }, [openModalCallback]);

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

type Option = {
  path: string;
  label: string;
  description?: string;
};

const options: Option[] = [
  {
    path: "/",
    label: "Home",
  },
  {
    path: "/documentation",
    label: "Documentation",
    description: "Read a short summary of the capabilities of the library.",
  },
  {
    path: "/examples",
    label: "Examples",
  },
  {
    path: "/playground",
    label: "Playground",
    description: "Play with the library's main functionalities and experience them in real time",
  },
  {
    path: "/documentation/quickstart",
    label: "Quick Start",
    description: "Learn how to start using the library itself with a single step.",
  },
  {
    path: "/documentation/converttoyaml",
    label: "Convert to YAML",
    description: "Learn how to convert Javascript objects into formatted YAMLs.",
  },
];

type ModalProps = {
  style?: CSSProperties;
  optionStyle?: CSSProperties;
  highlightedOptionStyle?: CSSProperties;
  footerStyle?: CSSProperties;
  closeModal: () => void;
};

type PickOptionArgs = {
  path: string;
};

const Modal = ({
  style,
  optionStyle,
  highlightedOptionStyle,
  footerStyle,
  closeModal,
}: ModalProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const optionContainerRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [filter, setFilter] = useState("");
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const { moveTo } = usePath();
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

  const pickOption = ({ path }: PickOptionArgs) => {
    moveTo({ pathname: path });
    closeModal();
  };

  return (
    <div
      style={{
        width: "600px",
        height: "400px",
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
          wrapperStyle={{ height: "80px", borderRadius: "5px" }}
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
              const { path } = option;
              pickOption({ path });
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
        {filter.length > 0 ? (
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
  displayableOptions: Option[];
  focusedIndex: number;
  optionRefs: RefObject<(HTMLDivElement | null)[]>;
  optionStyle?: CSSProperties;
  highlightedOptionStyle?: CSSProperties;
  setFocusedIndex: Dispatch<SetStateAction<number>>;
  pickOption: ({ path }: PickOptionArgs) => void;
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
    const { path, label, description } = option;

    const isHighlighted = focusedIndex === index;

    return (
      <div
        ref={(ref) => {
          optionRefs.current[index] = ref;
        }}
        key={path}
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
        onClick={() => pickOption({ path })}
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
