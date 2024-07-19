import { ReactNode, RefObject } from "react";

export type TooltipDisplayProps = {
  id: string;
  content: ReactNode;
  ref: RefObject<HTMLDivElement>;
  offset?: number;
};
