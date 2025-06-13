import { type ReactNode, type RefObject } from "react";
import type { EdgeWrapperRefs, Edges } from "@packages/edge-intersection";

export type TooltipDisplayProps = {
  id: string;
  content: ReactNode;
  ref?: RefObject<HTMLDivElement | null>;
  intersectionRefs: EdgeWrapperRefs;
  side?: Edges;
  offset?: {
    x?: number;
    y?: number;
  };
  distanceFromViewport?: number;
};
