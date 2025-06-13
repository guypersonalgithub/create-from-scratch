import { type ReactNode } from "react";

export type Group = {
  id: string;
  title: ReactNode;
};

export type Item = {
  id: string;
  label: string;
};

export type DraggedItemProperties = {
  groupId: string;
  index: number;
  item: Item;
  element: HTMLDivElement;
  rect: DOMRect;
  start: { x: number; y: number };
};

export type MousePosition = {
  x: number;
  y: number;
};
