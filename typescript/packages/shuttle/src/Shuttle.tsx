import { useState, type KeyboardEvent } from "react";

type Item = {
  id: string;
  label: string;
};

type ShuttleProps = {
  items: Item[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  className?: string;
};

export const Shuttle = ({ items, selectedIds, onChange, className }: ShuttleProps) => {
  // Separate items into available and selected
  const selectedItems = items.filter((i) => selectedIds.includes(i.id));
  const availableItems = items.filter((i) => !selectedIds.includes(i.id));

  // Move items between lists
  function addItems(ids: string[]) {
    onChange([...selectedIds, ...ids]);
  }

  function removeItems(ids: string[]) {
    onChange(selectedIds.filter((id) => !ids.includes(id)));
  }

  // Reorder selected items (up/down)
  function moveSelected(index: number, direction: -1 | 1) {
    const newSelected = [...selectedItems];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= newSelected.length) return;
    const tmp = newSelected[index];
    newSelected[index] = newSelected[newIndex];
    newSelected[newIndex] = tmp;
    onChange(newSelected.map((i) => i.id));
  }

  // Track focused item indices for keyboard support
  const [focusAvailableIndex, setFocusAvailableIndex] = useState<number | null>(null);
  const [focusSelectedIndex, setFocusSelectedIndex] = useState<number | null>(null);

  // Keyboard handler for Available list
  function onAvailableKeyDown(e: KeyboardEvent<HTMLUListElement>) {
    if (focusAvailableIndex === null) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusAvailableIndex(
        focusAvailableIndex < availableItems.length - 1 ? focusAvailableIndex + 1 : 0,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusAvailableIndex(
        focusAvailableIndex > 0 ? focusAvailableIndex - 1 : availableItems.length - 1,
      );
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const id = availableItems[focusAvailableIndex].id;
      addItems([id]);
      setFocusAvailableIndex(null);
    }
  }

  // Keyboard handler for Selected list
  function onSelectedKeyDown(e: KeyboardEvent<HTMLUListElement>) {
    if (focusSelectedIndex === null) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusSelectedIndex(
        focusSelectedIndex < selectedItems.length - 1 ? focusSelectedIndex + 1 : 0,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusSelectedIndex(
        focusSelectedIndex > 0 ? focusSelectedIndex - 1 : selectedItems.length - 1,
      );
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const id = selectedItems[focusSelectedIndex].id;
      removeItems([id]);
      setFocusSelectedIndex(null);
    } else if (e.key === "ArrowLeft") {
      // Move item up
      e.preventDefault();
      moveSelected(focusSelectedIndex, -1);
      setFocusSelectedIndex(focusSelectedIndex - 1 >= 0 ? focusSelectedIndex - 1 : 0);
    } else if (e.key === "ArrowRight") {
      // Move item down
      e.preventDefault();
      moveSelected(focusSelectedIndex, 1);
      setFocusSelectedIndex(
        focusSelectedIndex + 1 < selectedItems.length
          ? focusSelectedIndex + 1
          : selectedItems.length - 1,
      );
    }
  }

  return (
    <div
      className={`shuttle-container ${className || ""}`}
      style={{
        display: "flex",
        gap: 16,
        maxWidth: 600,
        userSelect: "none",
        fontFamily: "sans-serif",
      }}
    >
      {/* Available */}
      <div className="shuttle-list-container" style={{ flex: 1 }}>
        <div
          style={{
            fontWeight: "bold",
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          Available
        </div>
        <ul
          className="shuttle-list"
          tabIndex={0}
          role="listbox"
          aria-label="Available items"
          onKeyDown={onAvailableKeyDown}
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            border: "1px solid #ccc",
            maxHeight: 300,
            overflowY: "auto",
          }}
        >
          {availableItems.length === 0 && (
            <li
              style={{
                padding: "8px 12px",
                color: "#888",
                fontStyle: "italic",
              }}
            >
              No items
            </li>
          )}
          {availableItems.map((item, i) => (
            <li
              key={item.id}
              tabIndex={-1}
              aria-selected={focusAvailableIndex === i}
              onClick={() => addItems([item.id])}
              onFocus={() => setFocusAvailableIndex(i)}
              style={{
                padding: "8px 12px",
                backgroundColor: focusAvailableIndex === i ? "#bde4ff" : "transparent",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => addItems(availableItems.map((i) => i.id))}
          disabled={availableItems.length === 0}
          style={{
            marginTop: 8,
            width: "100%",
            padding: "6px 0",
            cursor: availableItems.length === 0 ? "not-allowed" : "pointer",
          }}
        >
          Add All &gt;&gt;
        </button>
      </div>

      {/* Buttons */}
      <div
        className="shuttle-buttons"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <button
          type="button"
          onClick={() =>
            addItems(focusAvailableIndex !== null ? [availableItems[focusAvailableIndex].id] : [])
          }
          disabled={focusAvailableIndex === null}
          aria-label="Add selected"
          style={{ padding: "6px 12px" }}
        >
          &gt;
        </button>
        <button
          type="button"
          onClick={() =>
            removeItems(focusSelectedIndex !== null ? [selectedItems[focusSelectedIndex].id] : [])
          }
          disabled={focusSelectedIndex === null}
          aria-label="Remove selected"
          style={{ padding: "6px 12px" }}
        >
          &lt;
        </button>
        <button
          type="button"
          onClick={() => removeItems(selectedItems.map((i) => i.id))}
          disabled={selectedItems.length === 0}
          style={{ padding: "6px 12px" }}
        >
          &lt;&lt; Remove All
        </button>
      </div>

      {/* Selected */}
      <div className="shuttle-list-container" style={{ flex: 1 }}>
        <div
          style={{
            fontWeight: "bold",
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          Selected
        </div>
        <ul
          className="shuttle-list"
          tabIndex={0}
          role="listbox"
          aria-label="Selected items"
          onKeyDown={onSelectedKeyDown}
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            border: "1px solid #ccc",
            maxHeight: 300,
            overflowY: "auto",
          }}
        >
          {selectedItems.length === 0 && (
            <li
              style={{
                padding: "8px 12px",
                color: "#888",
                fontStyle: "italic",
              }}
            >
              No items
            </li>
          )}
          {selectedItems.map((item, i) => (
            <li
              key={item.id}
              tabIndex={-1}
              aria-selected={focusSelectedIndex === i}
              onClick={() => removeItems([item.id])}
              onFocus={() => setFocusSelectedIndex(i)}
              style={{
                padding: "8px 12px",
                backgroundColor: focusSelectedIndex === i ? "#bde4ff" : "transparent",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                userSelect: "none",
              }}
              // You can hook your drag handlers here, e.g.:
              // draggable
              // onDragStart={...}
              // onDrop={...}
            >
              <span>{item.label}</span>
              <div style={{ display: "flex", gap: 4 }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveSelected(i, -1);
                    setFocusSelectedIndex(i > 0 ? i - 1 : 0);
                  }}
                  disabled={i === 0}
                  aria-label={`Move ${item.label} up`}
                  style={{ cursor: i === 0 ? "not-allowed" : "pointer" }}
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveSelected(i, 1);
                    setFocusSelectedIndex(i < selectedItems.length - 1 ? i + 1 : i);
                  }}
                  disabled={i === selectedItems.length - 1}
                  aria-label={`Move ${item.label} down`}
                  style={{ cursor: i === selectedItems.length - 1 ? "not-allowed" : "pointer" }}
                >
                  ↓
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
