import { type DrawTooltipArgs } from "./drawTooltip";

export type TooltipProperties = {
  id: string;
  text: string;
  x: number;
  y: number;
  padding?: number;
  fontSize?: number;
  textBaseline?: CanvasTextBaseline;
  font?: string;
  backgroundColor?: string;
  color?: string;
} & (ManualInsertedTooltip | AutomaticInsertedTooltip);

type ManualInsertedTooltip = {
  animated?: boolean;
  opacity: number;
  wasManualInsert?: true;
};

type AutomaticInsertedTooltip = {
  animated?: boolean;
  opacity: number;
  wasManualInsert?: never;
};

export type CanvasTooltipActions = {
  drawTooltip: (args: Omit<DrawTooltipArgs, "ctx">) => void;
  removeTooltip: (args: { id: string }) => void;
  animateTooltip: (args: Omit<DrawTooltipArgs, "ctx">) => void;
  onMouseMove: (args: {
    event: MouseEvent;
    canvas: HTMLCanvasElement;
    animate?: boolean;
    opacity?: number;
  }) => void;
  onMouseLeave: () => void;
};
