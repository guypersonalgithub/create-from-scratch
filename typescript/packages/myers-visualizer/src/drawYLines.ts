import { progressiveAnimate } from "@packages/request-animation-frame";
import type { Animation } from "./types";
import { markAnimationDone } from "./markAnimationDone";

type DrawYLinesArgs = {
  ctx: CanvasRenderingContext2D;
  newStr: string;
  startX: number;
  startY: number;
  distanceY: number;
  endX: number;
  animation?: Animation;
};

export const drawYLines = ({
  ctx,
  newStr,
  startX,
  startY,
  distanceY,
  endX,
  animation,
}: DrawYLinesArgs) => {
  const oldStrLength = newStr.length;

  if (!animation) {
    for (let i = 1; i < oldStrLength; i++) {
      const lineY = distanceY * i + startY;

      ctx.beginPath();
      ctx.moveTo(startX, lineY);
      ctx.lineTo(endX, lineY);
      ctx.stroke();
    }
  } else {
    const { staggered, borderDuration } = animation;
    const percentagePerPart = 1 / oldStrLength;

    const addition = endX - startX;

    const draw = ({ progress }: { progress: number }) => {
      if (staggered) {
        for (let i = 1; i < oldStrLength; i++) {
          const threshold = i * percentagePerPart;

          if (threshold > progress) {
            break;
          }

          const lineY = distanceY * i + startY;

          const difference = progress - threshold;
          const actualProgress =
            difference > percentagePerPart ? 1 : difference / percentagePerPart;

          ctx.beginPath();
          ctx.moveTo(startX, lineY);
          ctx.lineTo(startX + addition * actualProgress, lineY);
          ctx.stroke();
        }
      } else {
        for (let i = 1; i < oldStrLength; i++) {
          const lineY = distanceY * i + startY;

          ctx.beginPath();
          ctx.moveTo(startX, lineY);
          ctx.lineTo(startX + addition * progress, lineY);
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
};
