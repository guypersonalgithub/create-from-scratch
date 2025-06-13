import { type HoverableElement } from "./types";

type HoveredElementsArgs = {
  x: number;
  y: number;
  elements: HoverableElement[];
};

export const hoveredElements = ({ x, y, elements }: HoveredElementsArgs) => {
  return elements.find(
    (el) => x >= el.x && x <= el.x + el.width && y >= el.y && y <= el.y + el.height,
  );
};
