import { scaleCanvasByDevicePixelRatio } from "@packages/canvas-utils";
import { useEffect, useImperativeHandle, useRef, type RefObject } from "react";
import { initializeBorders } from "./initializeBorders";
import { dynatic } from "@packages/dynatic-css";
import { drawLabels } from "./drawLabels";
import { type DrawTextArgs, type ExternalRefProps, type Trace } from "./types";
import { drawTraces } from "./drawTraces";
import { calculateStepsAndDifference } from "./calculateStepsAndDifference";
import { calculateAverage } from "@packages/math";

type MyersStepVisualizerProps = {
  className?: string;
  externalRef?: RefObject<ExternalRefProps | null>;
} & DisplayTrace &
  IsSwitched;

type DisplayTrace =
  | ({
      displayLabels?: true;
      displayTrace?: boolean;
    } & TraceProps)
  | {
      displayLabels?: false;
      displayTrace?: never;
      trace?: never;
      displayTraceLabels?: never;
    };

type TraceProps =
  | {
      trace?: Trace[];
      displayTraceLabels?: boolean;
    }
  | {
      trace?: never;
      displayTraceLabels?: never;
    };

type IsSwitched =
  | {
      isSwitched?: true;
      keepPathsOf?: number[];
    }
  | {
      isSwitched?: false;
      keepPathsOf?: never;
    };

export const MyersStepVisualizer = ({
  className = dynatic`
    width: 500px;
    height: 500px;
  `,
  externalRef,
  trace = [],
  displayTraceLabels = true,
  isSwitched = false,
  displayLabels = true,
  displayTrace = true,
  keepPathsOf = [],
}: MyersStepVisualizerProps) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const positions = useRef<DrawTextArgs>({ xPositions: {}, yPositions: {} });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    contextRef.current = ctx;

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

    if (!displayLabels) {
      return;
    }

    const { stepsDifference, differenceRange, distanceX, distanceY } = calculateStepsAndDifference({
      trace,
      startX,
      startY,
      endX,
      endY,
    });

    const { xPositions, yPositions } = drawLabels({
      ctx,
      stepsDifference,
      differenceRange,
      startX,
      startY,
      distanceX,
      distanceY,
    });

    positions.current = { xPositions, yPositions };

    if (!displayTrace) {
      return;
    }

    drawTraces({ ctx, xPositions, yPositions, trace, displayTraceLabels, isSwitched, keepPathsOf });
  }, [isSwitched, displayLabels, displayTrace]);

  useImperativeHandle(externalRef, () => {
    return {
      drawText: ({ callback }) => {
        if (!contextRef.current) {
          return;
        }

        const ctx = contextRef.current;

        const { xFirst, xSecond, yFirst, ySecond, text } = callback(positions.current);

        const xAverage = calculateAverage({ data: [xSecond, xFirst] });
        const yAverage = calculateAverage({ data: [ySecond, yFirst] });

        const addition = text.length * 10;
        const substract = yAverage > yFirst;

        ctx.fillText(text, xAverage - addition, yAverage + (substract ? 40 : -40));
      },
      drawCircle: ({ callback }) => {
        if (!contextRef.current) {
          return;
        }

        const ctx = contextRef.current;

        const { xFirst, xSecond, yFirst, ySecond, radius } = callback(positions.current);

        const xAverage = calculateAverage({ data: [xSecond, xFirst] });
        const yAverage = calculateAverage({ data: [ySecond, yFirst] });

        ctx.beginPath();
        ctx.arc(xAverage, yAverage, radius, 0, 360);
        ctx.stroke();
      },
    };
  });

  return <canvas ref={ref} className={className} />;
};
