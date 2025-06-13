import { type ReactNode } from "react";

export type Anchor = {
  ref: HTMLElement;
  content: ReactNode;
  id: string;
};

export type AnchorData = {
  element: Element;
  index: number;
};
