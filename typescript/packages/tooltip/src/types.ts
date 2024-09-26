import { ReactNode, RefObject } from "react";
import type { EdgeWrapperRefs, Edges } from "@packages/edge-intersection";

export type TooltipDisplayProps = {
  id: string;
  content: ReactNode;
  ref?: RefObject<HTMLDivElement>;
  intersectionRefs: EdgeWrapperRefs;
  side?: Edges;
  offset?: {
    x?: number;
    y?: number;
  };
  distanceFromViewport?: number;
};