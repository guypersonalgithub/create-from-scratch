import { useEffect, useRef } from "react";
import { type CachedCalculatedProperties, type CalculatedSlice, type PieChartData } from "./types";
import { calculateBasicProperties, drawSliceSeparators } from "./utils";
import { scaleCanvasByDevicePixelRatio } from "@packages/canvas-utils";
import { progressiveAnimate } from "@packages/request-animation-frame";

type PieChartProps<T extends boolean> = {
  className?: string;
  data: PieChartData[];
  width?: number;
  height?: number;
  includeLabels?: T;
  drawSeparators?: boolean;
} & Animation<T>;

type Animation<T extends boolean> =
  | {
      animationDuration: number;
      staggered?: boolean;
      displayLabelAfterAnimation?: T extends true ? boolean : never;
    }
  | {
      animationDuration?: never;
      staggered?: never;
      displayLabelAfterAnimation?: never;
    };

export const PieChart = <T extends boolean>({
  className,
  data,
  width = 300,
  height = 300,
  includeLabels,
  drawSeparators,
  animationDuration,
  staggered,
  displayLabelAfterAnimation,
}: PieChartProps<T>) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previous = useRef<CachedCalculatedProperties>(
    calculateBasicProperties({ data, width, height, staggered, includeLabels }),
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    scaleCanvasByDevicePixelRatio({ canvas, ctx, width, height });

    const { centerX, centerY, radius, calculatedSlices } = previous.current;

    if (!animationDuration) {
      data.forEach((item, index) => {
        const sliceData = calculatedSlices[index];
        const { startAngle, sliceAngle } = sliceData;
        const endAngle = startAngle + sliceAngle;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = item.color;
        ctx.fill();

        if (includeLabels) {
          const { labelX, labelY } = sliceData as { labelX: number; labelY: number };

          ctx.fillStyle = "#fff";
          ctx.font = "bold 12px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(item.label, labelX, labelY);
        }

        if (drawSeparators) {
          drawSliceSeparators({ centerX, centerY, radius, angle: endAngle, ctx });
        }
      });

      return;
    }

    let animationStart: number | null = null;

    const draw = ({ progress }: { progress: number }) => {
      ctx.clearRect(0, 0, width, height);

      data.forEach((item, index) => {
        // add
        const sliceData = calculatedSlices[index] as CalculatedSlice<true>;
        const { startAngle, sliceAngle } = sliceData;

        let sliceProgress = progress;
        if (staggered) {
          const { sliceStart, sliceEnd } = sliceData;

          if (progress < sliceStart) {
            sliceProgress = 0;
          } else if (progress > sliceEnd) {
            sliceProgress = 1;
          } else {
            sliceProgress = (progress - sliceStart) / (sliceEnd - sliceStart);
          }
        }

        const endAngle = startAngle + sliceAngle * sliceProgress;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = item.color;
        ctx.fill();

        if (drawSeparators && sliceProgress === 1) {
          drawSliceSeparators({ centerX, centerY, radius, angle: endAngle, ctx });
        }

        if (includeLabels && (!displayLabelAfterAnimation || progress >= 1)) {
          const { labelX, labelY } = sliceData as { labelX: number; labelY: number };

          ctx.fillStyle = "#fff";
          ctx.font = "bold 12px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(item.label, labelX, labelY);
        }
      });
    };

    // const animate = (timestamp: number) => {
    //   if (animationStart === null) {
    //     animationStart = timestamp;
    //   }

    //   const elapsed = timestamp - animationStart;
    //   const progress = Math.min(elapsed / animationDuration, 1);

    //   draw(progress);

    //   if (progress < 1) {
    //     requestAnimationFrame(animate);
    //   }
    // };

    requestAnimationFrame(
      progressiveAnimate({ animationDuration, callback: draw, animationStart }),
    );
  }, [data, width, height]);

  return <canvas ref={canvasRef} className={className} width={width} height={height} />;
};
