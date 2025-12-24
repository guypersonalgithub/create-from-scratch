import { scaleCanvasByDevicePixelRatio } from "@packages/canvas-utils";
import { useEffect, useRef } from "react";
import { initializeBorders } from "./initializeBorders";
import { dynatic } from "@packages/dynatic-css";
import { drawLabels } from "./drawLabels";
import type { Trace } from "./types";
import { drawTraces } from "./drawTraces";
import { calculateMaxSteps } from "./calculateMaxSteps";
import { calculateDifferenceRange } from "./calculateDifferenceRange";

type MyersStepVisualizerProps = {
  className?: string;
  trace: Trace[];
} & IsSwitched;

type IsSwitched =
  | {
      isSwitched: boolean;
      keepPathsOf?: number[];
    }
  | {
      isSwitched?: never;
      keepPathsOf?: never;
    };

export const MyersStepVisualizer = ({
  className = dynatic`
    width: 500px;
    height: 500px;
  `,
  trace,
  isSwitched = false,
  keepPathsOf = [],
}: MyersStepVisualizerProps) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const { width, height } = canvas.getBoundingClientRect();
    scaleCanvasByDevicePixelRatio({ canvas, ctx, width, height });

    ctx.clearRect(0, 0, width, height);

    ctx.lineWidth = 3;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black";

    const startX = 50;
    const startY = 50;
    const endX = width - startX;
    const endY = height - startY;

    initializeBorders({ ctx, startX, startY, endX, endY });

    const steps = calculateMaxSteps({ trace });
    const stepsDifference = steps.max - steps.min;

    const differenceRange = calculateDifferenceRange({ trace });

    const distanceX = (endX - startX) / stepsDifference;
    const difference = Math.abs(differenceRange.min) + Math.abs(differenceRange.max) + 1; // including 0.
    const distanceY = (endY - startY) / difference;

    const { xPositions, yPositions } = drawLabels({
      ctx,
      stepsDifference,
      differenceRange,
      startX,
      startY,
      distanceX,
      distanceY,
    });

    drawTraces({ ctx, xPositions, yPositions, trace, isSwitched, keepPathsOf });
  }, [isSwitched]);

  return <canvas ref={ref} className={className} />;
};
