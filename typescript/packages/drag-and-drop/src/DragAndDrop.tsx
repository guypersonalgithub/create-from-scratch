import { DraggedItem } from "./DraggedItem";
import { DragAndDropWrapper } from "./DragAndDropWrapper";
import { type ReactNode, useState, useMemo } from "react";
import { DragAndDropGroup } from "./DragAndDropGroup";
import { type Group, type Item } from "./types";
import { useDragAndDropContext } from "./useDragAndDropContext";

type DragAndDropProps<T extends string[]> = {
  groups: {
    id: T[number];
    title: ReactNode;
  }[];
  items: {
    id: string;
    label: string;
    container: T[number];
  }[];
};

export const DragAndDrop = <T extends string[]>({ groups, items }: DragAndDropProps<T>) => {
  return (
    <DragAndDropWrapper>
      <DragAndDropContent groups={groups} items={items} />
      <DraggedItem />
    </DragAndDropWrapper>
  );
};

const DragAndDropContent = <T extends string[]>({ groups, items }: DragAndDropProps<T>) => {
  const { observer } = useDragAndDropContext();
  const [groupContainers, setGroupContainers] = useState<Group[]>(
    groups.map((group) => {
      return {
        id: group.id,
        title: group.title,
      };
    }),
  );

  const sortedGroups = useMemo(() => {
    const groups: Record<`group-${string}`, Item[]> = {};

    items.forEach((item) => {
      const { container, ...rest } = item;
      const id = `group-${container}` as `group-${string}`;
      if (!groups[id]) {
        groups[id] = [];
      }

      groups[id].push(rest);
    });

    observer.setState(groups);

    return groups;
  }, [items]);

  return (
    <div style={{ overflow: "auto", display: "flex", alignItems: "start" }}>
      {groupContainers.map((group) => {
        return (
          <DragAndDropGroup
            key={group.id}
            groupId={group.id}
            title={group.title}
            items={sortedGroups[`group-${group.id}`] ?? []}
          />
        );
      })}
    </div>
  );
};
