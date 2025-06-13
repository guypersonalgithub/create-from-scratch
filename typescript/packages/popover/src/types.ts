import { type Edges, type EdgeWrapperRefs } from "@packages/edge-intersection";
import { type CSSProperties, type ReactNode, type RefObject } from "react";

export type PopoverDisplayProps = {
  id: string;
  content: ReactNode | ((arg: { hidePopover: () => void }) => ReactNode);
  ref?: RefObject<HTMLDivElement | null>;
  intersectionRefs: EdgeWrapperRefs;
  side?: Edges;
  offset?: {
    x?: number;
    y?: number;
  };
  distanceFromViewport?: number;
  style?: CSSProperties;
};
