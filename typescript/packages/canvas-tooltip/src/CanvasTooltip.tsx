import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { CanvasTooltipActions } from "./types";
import { Tooltip } from "./tooltip";

type CanvasTooltipProps = {
  height: number;
  width: number;
};

export const CanvasTooltip = forwardRef<CanvasTooltipActions, CanvasTooltipProps>(
  ({ height, width }, ref) => {
    const innerRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const canvasTooltips = useRef<Tooltip[]>([]);

    useEffect(() => {
      const canvas = innerRef.current;

      if (!canvas) {
        return;
      }

      contextRef.current = canvas.getContext("2d");
    }, []);

    useImperativeHandle(ref, () => {
      return {
        animateTooltip: () => {
          if (!contextRef.current) {
            return;
          }
        },
      };
    }, []);
    return <canvas height={height} width={width} ref={innerRef} />;
  },
);
