import { useEffect, useRef } from "react";
import type { LineChartData } from "./types";
import { drawGraphAxes, scaleCanvasByDevicePixelRatio } from "@packages/canvas-utils";

type LineChartProps = {
  className?: string;
  data: LineChartData[];
  width?: number;
  height?: number;
  animationDuration?: number;
  axesOffset?: number;
  padding?: number;
};

export const LineChart = ({
  className,
  data,
  width = 300,
  height = 300,
  animationDuration,
  axesOffset = 0,
  padding = 0,
}: LineChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    let highestY = data[0].y;
    let highestX = data[0].x;

    for (let i = 1; i < data.length; i++) {
      const { x, y } = data[i];

      if (x > highestX) {
        highestX = x;
      }

      if (y > highestY) {
        highestY = y;
      }
    }

    const yScale = (height - axesOffset - padding) / highestY;
    const xScale = (width - axesOffset - padding) / highestX;

    if (!animationDuration) {
      drawGraphAxes({ ctx, width, height, offset: axesOffset });

      ctx.beginPath();

      data.forEach((dot) => {
        const { x, y } = dot;
        const actualY = height - y * yScale;
        const actualX = x * xScale;

        ctx.lineTo(actualX + axesOffset, actualY - axesOffset);
      });

      ctx.stroke();

      return;
    }

    // let totalLength = 0;
    // let segments = [];

    // for (let i = 0; i < data.length - 1; i++) {
    //   const p1 = data[i];
    //   const p2 = data[i + 1];
    //   const dx = p2.x - p1.x;
    //   const dy = p2.y - p1.y;
    //   const len = Math.hypot(dx, dy);

    //   segments.push({ p1, p2, len });
    //   totalLength += len;
    // }

    let animationStart: number | null = null;

    const draw = (progress: number) => {
      ctx.clearRect(0, 0, width, height);

      // ctx.beginPath();
      // const drawLength = totalLength * progress;
      // let drawn = 0;

      // for (const seg of segments) {
      //   if (drawn + seg.len < drawLength) {
      //     const actualY1 = height - seg.p1.y * yScale;
      //     const actualX1 = seg.p1.x * xScale;
      //     const actualY2 = height - seg.p2.y * yScale;
      //     const actualX2 = seg.p2.x * xScale;

      //     ctx.moveTo(actualX1 + axesOffset, actualY1 - axesOffset);
      //     ctx.lineTo(actualX2 + axesOffset, actualY2 - axesOffset);
      //     drawn += seg.len;
      //   } else {
      //     // draw partial segment
      //     const remain = drawLength - drawn;
      //     const ratio = remain / seg.len;

      //     const x = seg.p1.x + (seg.p2.x - seg.p1.x) * ratio;
      //     const y = seg.p1.y + (seg.p2.y - seg.p1.y) * ratio;

      //     const actualY = height - y * ratio * yScale;
      //     const actualX = x * ratio * xScale;

      //     ctx.lineTo(actualX + axesOffset, actualY - axesOffset);

      //     // ctx.moveTo(seg.p1.x, seg.p1.y);
      //     // ctx.lineTo(x, y);

      //     break;
      //   }
      // }

      // ctx.stroke();

      for (let i = 0; i < data.length; i++) {
        const { x, y } = data[i];

        const pointStartX = x / highestX;
        const pointStartY = y / highestY;

        const highestPoint = Math.max(pointStartX, pointStartY);

        let progressX = progress;
        let progressY = progress;

        progressX = progress > highestPoint ? 1 : progress / highestPoint;
        progressY = progress > highestPoint ? 1 : progress / highestPoint;

        const actualY = height - y * progressY * yScale;
        const actualX = x * progressX * xScale;

        ctx.lineTo(actualX + axesOffset, actualY - axesOffset);

        if (progressX !== 1 || progressY !== 1) {
          break;
        }
      }

      ctx.stroke();
    };

    const animate = (timestamp: number) => {
      if (animationStart === null) {
        animationStart = timestamp;
      }

      const elapsed = timestamp - animationStart;
      const progress = Math.min(elapsed / animationDuration, 1);

      draw(progress);

      // if (progress > 0.5) {
      //   return;
      // }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  return <canvas ref={canvasRef} className={className} width={width} height={height} />;
};
