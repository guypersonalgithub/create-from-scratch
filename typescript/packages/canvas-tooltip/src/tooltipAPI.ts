import {
  clearCanvas,
  getMousePosition,
  hoveredElements,
  type HoverableElement,
} from "@packages/canvas-utils";
import { drawAnimatedTooltipFrame } from "./drawAnimatedTooltipFrame";
import { drawTooltip } from "./drawTooltip";
import type { CanvasTooltipActions, TooltipProperties } from "./types";
import type { RefObject } from "react";

type GetTooltipApiArgs = {
  elements: HoverableElement[];
  ctx: CanvasRenderingContext2D;
  tooltips: RefObject<TooltipProperties[]>;
  animationRef: RefObject<number>;
  lastMousePosition: RefObject<
    | {
        x: number;
        y: number;
      }
    | undefined
  >;
  lastHovered: RefObject<HoverableElement | undefined>;
  height: number;
  width: number;
};

export const getTooltipAPI = ({
  elements,
  ctx,
  tooltips,
  animationRef,
  lastMousePosition,
  lastHovered,
  height,
  width,
}: GetTooltipApiArgs): CanvasTooltipActions => {
  const generateTooltipsFrame = ({ hovered }: { hovered?: HoverableElement }) => {
    tooltips.current = tooltips.current.filter((tooltip) => {
      const { id, wasManualInsert, animated, opacity } = tooltip;
      const isHovered = id === hovered?.id;

      const visibleManualTooltip = wasManualInsert && opacity > 0;
      const nonAnimatedHoveredTooltip = !animated && isHovered;
      const visibleAnimatedTooltip = animated && (opacity > 0 || isHovered);

      return visibleManualTooltip || nonAnimatedHoveredTooltip || visibleAnimatedTooltip;
    });

    let animationRequired = false;

    const callbacks = tooltips.current.map((tooltip) => {
      if (tooltip.wasManualInsert) {
        if (tooltip.animated) {
          const animating = tooltip.opacity < 1;
          if (animating) {
            animationRequired = true;
          }

          return () => {
            drawAnimatedTooltipFrame({
              ctx,
              tooltip,
              hovered: true,
              tooltips,
            });
          };
        }

        return () => {
          drawTooltip({
            ...tooltip,
            ctx,
            opacity: 1,
          });
        };
      }

      if (tooltip.animated) {
        const isHovered = tooltip.id === hovered?.id;

        const animating = (isHovered && tooltip.opacity < 1) || (!isHovered && tooltip.opacity > 0);
        if (animating) {
          animationRequired = true;
        }

        return () => {
          drawAnimatedTooltipFrame({
            ctx,
            tooltip,
            hovered: isHovered,
            tooltips,
          });
        };
      }

      return () => {
        drawTooltip({
          ...tooltip,
          ctx,
          opacity: 1,
        });
      };
    });

    return {
      animationRequired,
      callbacks,
    };
  };

  const drawTooltips = ({ hovered }: { hovered?: HoverableElement }) => {
    cancelAnimationFrame(animationRef.current);
    drawTooltipsContent({ hovered });
  };

  const drawTooltipsContent = ({ hovered }: { hovered?: HoverableElement }) => {
    clearCanvas({ ctx, width, height });
    const { animationRequired, callbacks } = generateTooltipsFrame({ hovered });

    if (animationRequired) {
      animationRef.current = requestAnimationFrame(() => drawTooltipsContent({ hovered }));
    }

    callbacks.forEach((callback) => callback());
  };

  return {
    drawTooltip: (args) => {
      if (!ctx) {
        return;
      }

      const tooltipExists = tooltips.current.find((tooltip) => tooltip.id === args.id);

      if (tooltipExists) {
        return;
      }

      tooltips.current.push({
        ...args,
        opacity: 1,
        animated: false,
        wasManualInsert: true,
      });

      let hovered: HoverableElement | undefined;
      if (lastMousePosition.current) {
        hovered = hoveredElements({ elements, ...lastMousePosition.current });
      }

      drawTooltips({ hovered });
    },
    removeTooltip: ({ id }) => {
      const tooltipIndex = tooltips.current.findIndex((tooltip) => tooltip.id === id);
      if (tooltipIndex === -1) {
        return;
      }

      tooltips.current[tooltipIndex].wasManualInsert = undefined;

      let hovered: HoverableElement | undefined;
      if (lastMousePosition.current) {
        hovered = hoveredElements({ elements, ...lastMousePosition.current });
      }

      drawTooltips({ hovered });
    },
    animateTooltip: (args) => {
      // if (!ctx) {
      //   return;
      // }
      // tooltips.current.push({
      //   ...args,
      //   opacity: 1,
      //   animated: true,
      //   wasManualInsert: true,
      // });
      // const drawCallback = (opacity: number) => {
      //   clearCanvas({ ctx, width, height });
      //   drawTooltip({ ctx, ...args, opacity });
      // };
      // animateTooltip({ hovered: true, drawTooltip: drawCallback });
    },
    onMouseMove: ({ event, canvas, animate, opacity = animate ? 0 : 1 }) => {
      if (!ctx) {
        return;
      }

      const mousePosition = getMousePosition({ event, canvas });
      lastMousePosition.current = mousePosition;
      if (!mousePosition) {
        return;
      }

      const hovered = hoveredElements({ elements, ...mousePosition });

      if (hovered?.id === lastHovered.current?.id) {
        return;
      }

      if (hovered) {
        const tooltipIndex = tooltips.current.findIndex((tooltip) => tooltip.id === hovered.id);
        if (tooltipIndex === -1) {
          tooltips.current.push({
            ...hovered,
            text: "test",
            opacity,
            animated: animate,
          });
        }
      }

      lastHovered.current = hovered;

      drawTooltips({ hovered });
    },
    onMouseLeave: () => {
      if (tooltips.current.length === 0) {
        return;
      }

      drawTooltips({});
    },
  };
};
