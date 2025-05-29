import { useContext } from "react";
import { DragAndDropContext } from "./DragAndDropWrapper";

export const useDragAndDropContext = () => {
  const withinDragAndDrop = useContext(DragAndDropContext);
  if (!withinDragAndDrop) {
    throw new Error("Attempted to use useDragAndDropContext on a level above a drag and drop.");
  }

  return withinDragAndDrop;
};
