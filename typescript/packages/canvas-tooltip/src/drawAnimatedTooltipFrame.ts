import { RefObject } from "react";
import { drawTooltip } from "./drawTooltip";
import { TooltipProperties } from "./types";

type DrawAnimatedTooltipFrameArgs = {
  ctx: CanvasRenderingContext2D;
  hovered: boolean;
  tooltip: Omit<TooltipProperties, "animated">;
  animationSpeed?: number;
  tooltips: RefObject<TooltipProperties[]>
};

export const drawAnimatedTooltipFrame = ({
  animationSpeed = 0.05,
  hovered,
  ctx,
  tooltip,
  tooltips,
}: DrawAnimatedTooltipFrameArgs) => {
  let tooltipOpacity = tooltip.opacity;
  if (hovered && tooltipOpacity < 1 && tooltipOpacity >= 0) {
    tooltipOpacity += animationSpeed;
    if (tooltipOpacity > 1) {
      tooltipOpacity = 1;
    }
  } else if (!hovered && tooltipOpacity > 0) {
    tooltipOpacity -= animationSpeed;
    if (tooltipOpacity < 0) {
      tooltipOpacity = 0;
    }
  }

  const currentTooltipIndex = tooltips.current.findIndex((tp) => tp.id === tooltip.id);
  if (currentTooltipIndex === -1) {
    return;
  }

  tooltips.current[currentTooltipIndex].opacity = tooltipOpacity;

  drawTooltip({ ctx, ...tooltip, opacity: tooltipOpacity });
};
