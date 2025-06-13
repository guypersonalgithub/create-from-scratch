import { type RefObject } from "react";

export type Edges =
  | "top"
  | "topRight"
  | "topLeft"
  | "bottom"
  | "bottomRight"
  | "bottomLeft"
  | "left"
  | "right";

export type CustomEdges = `custom${Capitalize<Edges>}`;

export type EdgeWrapperRefs = {
  [K in Edges]: RefObject<HTMLDivElement | null>;
} & {
  [K in CustomEdges]?: RefObject<HTMLDivElement | null>;
};
