import { useEffect, useRef, useState } from "react";
import { type DraggedItemProperties, type Item } from "./types";
import { usePreventTextSelection } from "@packages/hooks";
import { useDragAndDropContext } from "./useDragAndDropContext";
import { type Observer } from "@packages/design-patterns";
import { type ObserverProperties } from "./DragAndDropWrapper";
import { dynatic } from "@packages/dynatic-css";

export const DraggedItem = () => {
  const { observer } = useDragAndDropContext();
  const [draggedItem, setDraggedItem] = useState<DraggedItemProperties | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = observer.subscribe({
      full: false,
      initial: true,
      properties: ["draggedItem"],
      callback: ({ draggedItem }) => setDraggedItem(draggedItem),
    });

    return () => unsubscribe();
  });

  if (!draggedItem) {
    return null;
  }

  return <DraggedItemContent draggedItem={draggedItem} observer={observer} />;
};

type DraggedItemContentProps = {
  draggedItem: DraggedItemProperties;
  observer: Observer<ObserverProperties>;
};

const DraggedItemContent = ({ draggedItem, observer }: DraggedItemContentProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const position = useRef({
    x: draggedItem.rect.left,
    y: draggedItem.rect.top,
  });
  usePreventTextSelection();

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    let lastGroupId: string | undefined;

    const { groupContainers } = observer.getState();

    const onMouseMove = (e: MouseEvent) => {
      handleMouseMove(e);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX - draggedItem.start.x;
      const y = e.clientY - draggedItem.start.y;

      ref.current!.style.left = `${x}px`;
      ref.current!.style.top = `${y}px`;

      let isWithinAGroup = false;

      for (const group in groupContainers) {
        const element = groupContainers[group];
        const rect = element.getBoundingClientRect();

        const isWithinX = x >= rect.left && x <= rect.right;
        const isWithinY = y >= rect.top && y <= rect.bottom + 50;

        if (isWithinX && isWithinY) {
          isWithinAGroup = true;
          if (lastGroupId !== group) {
            observer.setState({ mousePosition: { x, y }, hoveredGroup: group });
            lastGroupId = group;

            return;
          }
          observer.setState({ mousePosition: { x, y } });

          return;
        }
      }

      if (lastGroupId !== undefined && !isWithinAGroup) {
        lastGroupId = undefined;
        observer.setState({ mousePosition: undefined, hoveredGroup: undefined });

        return;
      }
    };

    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  useEffect(() => {
    const onMouseUp = () => {
      const { draggedItem, previewHover, hoveredGroup, ...rest } = observer.getState();

      if (!hoveredGroup) {
        observer.setState({
          previewHover: undefined,
          draggedItem: undefined,
          mousePosition: undefined,
        });

        return;
      }

      if (!previewHover || !draggedItem) {
        return;
      }

      const { groupId, index } = draggedItem;
      const dropKey = `group-${previewHover.groupId}` as `group-${string}`;
      const dropGroup = (rest[dropKey] ?? []).slice();
      dropGroup.splice(previewHover.previewIndex, 0, draggedItem.item);

      let removeGroup: Item[] | undefined;
      const removeKey = `group-${groupId}` as `group-${string}`;
      if (groupId !== previewHover.groupId) {
        removeGroup = (rest[removeKey] ?? []).slice();
        removeGroup.splice(index, 1);
      } else {
        let removeIndex = index;
        if (previewHover.previewIndex < index) {
          removeIndex += 1;
        }
        dropGroup.splice(removeIndex, 1);
      }

      const newState: Partial<ObserverProperties> = {
        previewHover: undefined,
        draggedItem: undefined,
        mousePosition: undefined,
        hoveredGroup: undefined,
        [dropKey]: dropGroup,
      };

      if (removeGroup) {
        newState[removeKey] = removeGroup;
      }

      observer.setState(newState);
    };

    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  useEffect(() => {
    const container = ref.current;
    if (container) {
      container.innerHTML = "";
      container.appendChild(draggedItem.element);
    }

    return () => {
      container?.replaceChildren(); // Clean up
    };
  }, [draggedItem]);

  return (
    <div
      ref={ref}
      className={dynatic`
        position: fixed;
        pointer-events: none;
        z-index: 1000;
      `}
      style={{
        top: position.current.y,
        left: position.current.x,
      }}
    />
  );
};
