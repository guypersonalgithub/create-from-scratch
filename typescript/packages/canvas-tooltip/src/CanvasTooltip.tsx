import { type RefObject, useEffect, useImperativeHandle, useRef } from "react";
import { type CanvasTooltipActions, type TooltipProperties } from "./types";
import { drawTooltip } from "./drawTooltip";
import {
  clearCanvas,
  getMousePosition,
  type HoverableElement,
  hoveredElements,
} from "@packages/canvas-utils";
import { drawAnimatedTooltipFrame } from "./drawAnimatedTooltipFrame";

export type CanvasTooltipProps = {
  elements: HoverableElement[];
  height: number;
  width: number;
  ref: RefObject<CanvasTooltipActions | null>;
};

export const CanvasTooltip = ({ elements, height, width, ref }: CanvasTooltipProps) => {
  const innerRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationRef = useRef<number>(0);
  const tooltips = useRef<TooltipProperties[]>([]);
  const lastMousePosition = useRef<
    | {
        x: number;
        y: number;
      }
    | undefined
  >(undefined);
  const lastHovered = useRef<HoverableElement | undefined>(null);

  useEffect(() => {
    const canvas = innerRef.current;

    if (!canvas) {
      return;
    }

    contextRef.current = canvas.getContext("2d");
  }, []);

  useImperativeHandle(ref, () => {
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
                ctx: contextRef.current!,
                tooltip,
                hovered: true,
                tooltips,
              });
            };
          }

          return () => {
            drawTooltip({
              ...tooltip,
              ctx: contextRef.current!,
              opacity: 1,
            });
          };
        }

        if (tooltip.animated) {
          const isHovered = tooltip.id === hovered?.id;

          const animating =
            (isHovered && tooltip.opacity < 1) || (!isHovered && tooltip.opacity > 0);
          if (animating) {
            animationRequired = true;
          }

          return () => {
            drawAnimatedTooltipFrame({
              ctx: contextRef.current!,
              tooltip,
              hovered: isHovered,
              tooltips,
            });
          };
        }

        return () => {
          drawTooltip({
            ...tooltip,
            ctx: contextRef.current!,
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
      clearCanvas({ ctx: contextRef.current!, width, height });
      const { animationRequired, callbacks } = generateTooltipsFrame({ hovered });

      if (animationRequired) {
        animationRef.current = requestAnimationFrame(() => drawTooltipsContent({ hovered }));
      }

      callbacks.forEach((callback) => callback());
    };

    return {
      drawTooltip: (args) => {
        if (!contextRef.current) {
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
        // if (!contextRef.current) {
        //   return;
        // }
        // tooltips.current.push({
        //   ...args,
        //   opacity: 1,
        //   animated: true,
        //   wasManualInsert: true,
        // });
        // const drawCallback = (opacity: number) => {
        //   clearCanvas({ ctx: contextRef.current!, width, height });
        //   drawTooltip({ ctx: contextRef.current!, ...args, opacity });
        // };
        // animateTooltip({ hovered: true, drawTooltip: drawCallback });
      },
      onMouseMove: ({ event, canvas, animate, opacity = animate ? 0 : 1 }) => {
        if (!contextRef.current) {
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
  }, []);

  return <canvas height={height} width={width} ref={innerRef} />;
};
