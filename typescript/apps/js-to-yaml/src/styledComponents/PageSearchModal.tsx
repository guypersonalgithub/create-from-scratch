import { Button } from "@packages/button";
import { useControlModal } from "@packages/modal";
import { MagnifyingGlass } from "@packages/icons";
import { Badge } from "@packages/badge";
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@packages/input";
import { usePath } from "@packages/router";
import { Key } from "@packages/keyboard-key";

type PageSearchModalProps = {
  buttonStyle?: CSSProperties;
  badgeStyle?: CSSProperties;
  modalStyle?: CSSProperties;
};

// TODO: turn into a package for potential reusability in other workspaces.

export const PageSearchModal = ({ buttonStyle, badgeStyle, modalStyle }: PageSearchModalProps) => {
  const { openModal, closeModal } = useControlModal();
  const isModalOpen = useRef(false);

  const openModalCallback = useCallback(() => {
    openModal({
      content: <Modal style={modalStyle} closeModal={closeModal} />,
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

const options: {
  path: string;
  label: string;
  description: string;
}[] = [
  {
    path: "/documentation",
    label: "Documentation",
    description: "",
  },
  {
    path: "/examples",
    label: "Examples",
    description: "",
  },
  {
    path: "/playground",
    label: "Playground",
    description: "Play with the library's main functionalities and experience them in real time",
  },
];

type ModalProps = {
  style?: CSSProperties;
  closeModal: () => void;
};

const Modal = ({ style, closeModal }: ModalProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [filter, setFilter] = useState("");
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
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

  useEffect(() => {
    if (focusedIndex === null) {
      ref.current?.focus();
    } else {
      optionRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex]);

  const displayableOptions = options.filter(
    (option) =>
      option.label.toLowerCase().includes(lowercaseFilter) ||
      option.description.toLowerCase().includes(lowercaseFilter),
  );

  return (
    <div
      style={{
        width: "600px",
        height: "400px",
        backgroundColor: "white",
        borderRadius: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        ...style,
      }}
    >
      <Input
        externalRef={ref}
        wrapperStyle={{ height: "40px", borderRadius: "10px" }}
        value={filter}
        onChange={(e) => {
          optionRefs.current = [];
          setFilter(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setFocusedIndex(0);
          }
        }}
        placeholder="Search docs"
      />
      <div style={{ height: "100%" }}>
        {filter.length > 0 ? (
          displayableOptions.map((option, index) => {
            const { path, label, description } = option;

            const pickOption = () => {
              moveTo({ pathname: path });
              closeModal();
            };

            return (
              <div
                key={path}
                ref={(ref) => {
                  optionRefs.current[index] = ref;
                }}
                style={{
                  cursor: "pointer",
                  transition: "background-color 0.3s ease-in",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "10px",
                  fontWeight: "bold",
                  margin: "10px",
                  borderRadius: "10px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "red";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "";
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = "1px solid red";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = "none";
                }}
                onClick={pickOption}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    pickOption();
                  } else if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setFocusedIndex((prev) =>
                      prev === options.length - 1 ? prev : (prev ?? -1) + 1,
                    );
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setFocusedIndex((prev) => (prev === 0 || prev === null ? null : prev - 1));
                  }
                }}
                tabIndex={-1}
              >
                <div>
                  <div>{label}</div>
                  <div style={{ fontSize: "12px" }}>{description}</div>
                </div>
              </div>
            );
          })
        ) : (
          <div>Start typing to see results.</div>
        )}
      </div>
      <div style={{ borderTop: "3px solid black", marginBottom: "5px" }} />
      <div
        style={{
          display: "flex",
          gap: "10px",
          paddingBottom: "10px",
          paddingLeft: "10px",
          color: "#99989d",
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
