import { dynatic } from "@packages/dynatic-css";
import { combineStringsWithSpaces } from "@packages/string-utils";
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
      className={combineStringsWithSpaces(
        dynatic`
          display: flex;
          gap: 16px;
          max-width: 600px;
          user-select: none;
          font-family: sans-serif;
        `,
        className,
      )}
    >
      {/* Available */}
      <div
        className={dynatic`
          flex: 1;
        `}
      >
        <div
          className={dynatic`
            font-weight: bold;
            margin-bottom: 8px;
            text-align: center;  
          `}
        >
          Available
        </div>
        <ul
          className={dynatic`
            list-style: none;
            padding: 0;
            margin: 0;
            border: 1px solid #ccc;
            max-height: 300px;
            overflow-y: auto;  
          `}
          tabIndex={0}
          role="listbox"
          aria-label="Available items"
          onKeyDown={onAvailableKeyDown}
        >
          {availableItems.length === 0 && (
            <li
              className={dynatic`
                padding: 8px 12px;
                color: #888;
                font-style: italic;  
              `}
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
              className={combineStringsWithSpaces(
                dynatic`
                  padding: 8px 12px;
                  cursor: pointer;
                  border-bottom: 1px solid #eee;
                `,
                focusAvailableIndex === i
                  ? dynatic`
                      background-color: #bde4ff;
                    `
                  : dynatic`
                      background-color: transparent;
                    `,
              )}
            >
              {item.label}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => addItems(availableItems.map((i) => i.id))}
          disabled={availableItems.length === 0}
          className={combineStringsWithSpaces(
            dynatic`
              margin-top: 8px;
              width: 100%;
              padding: 6px 0;
            `,
            availableItems.length === 0
              ? dynatic`
                  cursor: not-allowed;
                `
              : dynatic`
                  cursor: pointer;
                `,
          )}
        >
          Add All &gt;&gt;
        </button>
      </div>

      {/* Buttons */}
      <div
        className={dynatic`
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 8px;  
        `}
      >
        <button
          type="button"
          onClick={() =>
            addItems(focusAvailableIndex !== null ? [availableItems[focusAvailableIndex].id] : [])
          }
          disabled={focusAvailableIndex === null}
          aria-label="Add selected"
          className={dynatic`
            padding: 6px 12px;  
          `}
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
          className={dynatic`
            padding: 6px 12px;  
          `}
        >
          &lt;
        </button>
        <button
          type="button"
          onClick={() => removeItems(selectedItems.map((i) => i.id))}
          disabled={selectedItems.length === 0}
          className={dynatic`
            padding: 6px 12px;  
          `}
        >
          &lt;&lt; Remove All
        </button>
      </div>

      {/* Selected */}
      <div
        className={dynatic`
          flex: 1;
        `}
      >
        <div
          className={dynatic`
            font-weight: bold;
            margin-bottom: 8px;
            text-align: center;
          `}
        >
          Selected
        </div>
        <ul
          className={dynatic`
            list-style: none;
            padding: 0;
            margin: 0;
            border: 1px solid #ccc;
            max-height: 300px;
            overflow-y: auto;
          `}
          tabIndex={0}
          role="listbox"
          aria-label="Selected items"
          onKeyDown={onSelectedKeyDown}
        >
          {selectedItems.length === 0 && (
            <li
              className={dynatic`
                padding: 8px 12px;
                color: #888;
                font-style: italic;
              `}
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
              className={combineStringsWithSpaces(
                dynatic`
                  padding: 8px 12px;
                  cursor: pointer;
                  border-bottom: 1px solid #eee;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  user-select: none;
                `,
                focusAvailableIndex === i
                  ? dynatic`
                      background-color: #bde4ff;
                    `
                  : dynatic`
                      background-color: transparent;
                    `,
              )}
              // You can hook your drag handlers here, e.g.:
              // draggable
              // onDragStart={...}
              // onDrop={...}
            >
              <span>{item.label}</span>
              <div
                className={dynatic`
                  display: flex;
                  gap: 4px;
                `}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveSelected(i, -1);
                    setFocusSelectedIndex(i > 0 ? i - 1 : 0);
                  }}
                  disabled={i === 0}
                  aria-label={`Move ${item.label} up`}
                  className={
                    i === 0
                      ? dynatic`
                          cursor: not-allowed;
                        `
                      : dynatic`
                          cursor: pointer;
                        `
                  }
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
                  className={
                    selectedItems.length === 0
                      ? dynatic`
                          cursor: not-allowed;
                        `
                      : dynatic`
                          cursor: pointer;
                        `
                  }
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
