import { Observer } from "@packages/design-patterns";
import { createContext, ReactNode } from "react";
import { DraggedItemProperties, Item, MousePosition } from "./types";

export type ObserverProperties = {
  mousePosition?: MousePosition;
  draggedItem?: DraggedItemProperties;
  groupContainers: Record<string, HTMLDivElement>;
  hoveredGroup?: string;
  previewHover?: {
    groupId: string;
    previewIndex: number;
  }
} & {
  [key in `group-${string}`]?: Item[];
};

export const DragAndDropContext = createContext<{
  observer: Observer<ObserverProperties>;
} | null>(null);

type DragAndDropWrapperProps = {
  children: ReactNode;
};

export const DragAndDropWrapper = ({ children }: DragAndDropWrapperProps) => {
  return (
    <DragAndDropContext.Provider
      value={{
        observer: new Observer<ObserverProperties>({ groupContainers: {} }),
      }}
    >
      {children}
    </DragAndDropContext.Provider>
  );
};
