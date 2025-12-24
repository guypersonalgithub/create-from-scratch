import { markAnimationDone } from "./markAnimationDone";
import type { Animation } from "./types";
import { progressiveAnimate } from "@packages/request-animation-frame";

type DrawXLinesAndLabelsArgs = {
  ctx: CanvasRenderingContext2D;
  oldStr: string;
  startX: number;
  startY: number;
  distanceX: number;
  endY: number;
  animation?: Animation;
};

export const drawXLinesAndLabels = ({
  ctx,
  oldStr,
  startX,
  startY,
  distanceX,
  endY,
  animation,
}: DrawXLinesAndLabelsArgs) => {
  const oldStrLength = oldStr.length;

  if (!animation) {
    for (let i = 1; i < oldStrLength; i++) {
      const lineX = distanceX * i + startX;

      ctx.beginPath();
      ctx.moveTo(lineX, startY);
      ctx.lineTo(lineX, endY);
      ctx.stroke();
    }
  } else {
    const { staggered, borderDuration } = animation;
    const percentagePerPart = 1 / oldStrLength;

    const addition = endY - startY;

    const draw = ({ progress }: { progress: number }) => {
      if (staggered) {
        for (let i = 1; i < oldStrLength; i++) {
          const threshold = i * percentagePerPart;

          if (threshold > progress) {
            break;
          }

          const lineX = distanceX * i + startX;

          const difference = progress - threshold;
          const actualProgress =
            difference > percentagePerPart ? 1 : difference / percentagePerPart;

          ctx.beginPath();
          ctx.moveTo(lineX, startY);
          ctx.lineTo(lineX, startY + addition * actualProgress);
          ctx.stroke();
        }
      } else {
        for (let i = 1; i < oldStrLength; i++) {
          const lineX = distanceX * i + startX;

          ctx.beginPath();
          ctx.moveTo(lineX, startY);
          ctx.lineTo(lineX, startY + addition * progress);
          ctx.stroke();
        }
      }
    };

    let animationStart: number | null = null;

    requestAnimationFrame(
      progressiveAnimate({
        animationStart,
        callback: draw,
        animationDuration: borderDuration,
        onEnd: markAnimationDone,
      }),
    );
  }

  for (let i = 0; i < oldStrLength; i++) {
    const current = oldStr[i];
    const num = i + 1;
    const x = distanceX * num + startX;

    ctx.fillText(current, x, startY - 20);

    if (i < oldStrLength - 1) {
      ctx.fillText(`${num}`, x, endY + 20);
    }
  }
};
