import { useState, type CSSProperties, type MouseEvent, useEffect, useRef } from "react";
import { type DraggedItemProperties, type Group, type Item, type MousePosition } from "./types";
import { deepCopyStyles } from "@packages/css-utils";
import { useDragAndDropContext } from "./useDragAndDropContext";

const containerStyle: CSSProperties = {
  width: "300px",
  margin: "2rem auto",
  padding: "1rem",
  border: "2px dashed #aaa",
  borderRadius: "8px",
  position: "relative",
};

const itemStyle: CSSProperties = {
  padding: "10px",
  margin: "4px 0",
  backgroundColor: "#f0f0f0",
  border: "1px solid #ccc",
  borderRadius: "4px",
  cursor: "grab",
};

type DragAndDropGroupProps = Pick<Group, "title"> & { groupId: string; items: Item[] };

export const DragAndDropGroup = ({ groupId, title, items }: DragAndDropGroupProps) => {
  const { observer } = useDragAndDropContext();
  const [displayedItems, setDisplayedItems] = useState<Item[]>(items);

  const [draggedItemId, setDraggedItemId] = useState<string | undefined>(undefined);
  const [previewIndex, setPreviewIndex] = useState<number | undefined>(undefined);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const placeholderRef = useRef<HTMLDivElement>(null);
  const lastPreviewIndexRef = useRef<number | undefined>(undefined);
  const clonedPlaceholder = useRef<{ id: string; element: HTMLDivElement }>(null);

  const handleMouseMove = ({
    y,
    draggedItem,
  }: Pick<MousePosition, "y"> & { draggedItem?: DraggedItemProperties }) => {
    if (!draggedItem) {
      return;
    }

    const entries = Array.from(itemRefs.current.entries());

    let potentialIndex = entries.length;

    for (let i = 0; i < entries.length; i++) {
      const [, el] = entries[i];
      const rect = el.getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;

      if (y < midpoint) {
        potentialIndex = i;
        break;
      }
    }

    const addition = draggedItem.groupId === groupId && draggedItem.index <= potentialIndex ? 1 : 0;
    const newIndex = potentialIndex + addition;
    if (lastPreviewIndexRef.current !== newIndex) {
      lastPreviewIndexRef.current = newIndex;
      setPreviewIndex(newIndex);
      observer.setState({
        previewHover: {
          groupId,
          previewIndex: newIndex,
        },
      });
    }
  };

  useEffect(() => {
    const unsubscribe = observer.subscribe({
      full: false,
      initial: true,
      properties: ["draggedItem", "hoveredGroup", "mousePosition", `group-${groupId}`],
      callback: ({ draggedItem, hoveredGroup, mousePosition, ...rest }) => {
        const items = rest[`group-${groupId}`];
        if (items) {
          setDisplayedItems(items);
        }

        if (!draggedItem && clonedPlaceholder.current === null) {
          return;
        }

        if (
          hoveredGroup === groupId &&
          draggedItem &&
          clonedPlaceholder.current?.id !== draggedItem.item.id
        ) {
          const previewClone = draggedItem.element.cloneNode(true) as HTMLDivElement;
          deepCopyStyles({ source: draggedItem.element, target: previewClone });
          clonedPlaceholder.current = { id: draggedItem.item.id, element: previewClone };
          setDraggedItemId(draggedItem.item.id);
        }

        if (!draggedItem) {
          clonedPlaceholder.current = null;
          setDraggedItemId(undefined);
        } else if (hoveredGroup === groupId && mousePosition) {
          handleMouseMove({ y: mousePosition.y, draggedItem });
        } else {
          lastPreviewIndexRef.current = undefined;
          setPreviewIndex(undefined);
        }
      },
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const container = placeholderRef.current;
    const clone = clonedPlaceholder.current;
    if (!container || !clone) {
      return;
    }

    container.appendChild(clone.element);

    return () => {
      if (container.contains(clone.element)) {
        container.removeChild(clone.element);
      }
    };
  }, [previewIndex]);

  const setGroupRef = (id: string) => (el: HTMLDivElement | null) => {
    const { groupContainers } = observer.getState();
    const clone = { ...groupContainers };
    if (el) {
      clone[id] = el;
    } else {
      delete clone[id];
    }

    observer.setState({ groupContainers: clone });
  };

  const setItemRef = (id: string) => (el: HTMLDivElement | null) => {
    if (el) {
      itemRefs.current.set(id, el);
    } else {
      itemRefs.current.delete(id);
    }
  };

  const handleDragStart = (e: MouseEvent, id: string, index: number) => {
    const element = e.currentTarget as HTMLDivElement;
    const rect = element.getBoundingClientRect();
    const item = displayedItems.find((item) => item.id === id);
    if (!item) {
      return;
    }

    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const clone = element.cloneNode(true) as HTMLDivElement;
    const previewClone = element.cloneNode(true) as HTMLDivElement;

    // Clean up styles that would interfere
    clone.style.position = "static";
    clone.style.margin = "0";
    clone.style.pointerEvents = "none";

    // Copy computed styles
    deepCopyStyles({ source: element, target: clone });
    deepCopyStyles({ source: element, target: previewClone });
    const draggedItem = {
      groupId,
      index,
      item,
      element: clone,
      rect,
      start: { x: offsetX, y: offsetY },
    };

    clonedPlaceholder.current = { id, element: previewClone };
    setDraggedItemId(item.id);
    setPreviewIndex(index);
    observer.setState({
      draggedItem,
      hoveredGroup: groupId,
      mousePosition: { x: draggedItem.rect.left, y: draggedItem.rect.top },
      previewHover: {
        groupId,
        previewIndex: index,
      },
    });
  };

  const itemsWithPlaceholder = [...displayedItems];
  if (draggedItemId) {
    if (previewIndex !== undefined) {
      itemsWithPlaceholder.splice(previewIndex, 0, { id: "__PLACEHOLDER__", label: "" });
    }
  }

  const Item = ({ item, index }: { item: Item; index: number }) => {
    return (
      <div
        ref={setItemRef(item.id)}
        style={itemStyle}
        onMouseDown={(e) => handleDragStart(e, item.id, index)}
      >
        {item.label}
      </div>
    );
  };

  return (
    <div ref={setGroupRef(groupId)} style={containerStyle}>
      {title}
      {itemsWithPlaceholder.map((item, index) => {
        if (item.id === "__PLACEHOLDER__") {
          return <div key="__placeholder__" ref={placeholderRef} style={{ opacity: 0.5 }} />;
        }

        if (item?.id === draggedItemId) {
          return null;
        }

        return <Item key={item.id} index={index} item={item} />;
      })}
    </div>
  );
};
