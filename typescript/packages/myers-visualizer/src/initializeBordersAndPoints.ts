import { progressiveAnimate } from "@packages/request-animation-frame";
import type { Animation } from "./types";
import type { TwoDimensionalPoint } from "@packages/math";
import { markAnimationDone } from "./markAnimationDone";

type InitializeBordersAndPointsArgs = {
  ctx: CanvasRenderingContext2D;
  oldStr: string;
  newStr: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  animation?: Animation;
};

export const initializeBordersAndPoints = ({
  ctx,
  oldStr,
  newStr,
  startX,
  startY,
  endX,
  endY,
  animation,
}: InitializeBordersAndPointsArgs) => {
  const width = endX - startX;
  const height = endY - startY;

  ctx.beginPath();
  /*
    Canvas strokes sit on 0.5-pixel boundaries when using whole-number coordinates.
    For example, drawing a line from (10, 10) to (100, 10), the stroke is centered at y = 10, 
    but pixel centers are at y = 10.5, so the stroke actually spreads from y = 9.5 to 10.5
  
    The line below is equivalent to:
    ctx.moveTo(startX + 0.5, startY + 0.5);
    ctx.lineTo(startX + 0.5, endY - 0.5);
  ctx.lineTo(endX - 0.5, endY - 0.5);
    ctx.lineTo(endX - 0.5, startY + 0.5);
    ctx.lineTo(startX + 0.5, startY + 0.5); or ctx.closePath();
  */

  if (!animation) {
    ctx.rect(startX + 0.5, startY + 0.5, width - 1, height - 1);
    ctx.stroke();
  } else {
    const { staggered, borderDuration } = animation;
    const percentagePerPart = 0.25;

    const parts: TwoDimensionalPoint[] = [
      { x: startX + 0.5, y: endY - 0.5 },
      { x: endX - 0.5, y: endY - 0.5 },
      { x: endX - 0.5, y: startY + 0.5 },
      { x: startX + 0.5, y: startY + 0.5 },
    ];

    const draw = ({ progress }: { progress: number }) => {
      let start = { x: startX + 0.5, y: startY + 0.5 };

      ctx.moveTo(startX + 0.5, startY + 0.5);

      if (staggered) {
        for (let i = 0; i < parts.length; i++) {
          const threshold = i * percentagePerPart;

          if (threshold > progress) {
            break;
          }

          const { x, y } = parts[i];

          if (i > 0) {
            start = parts[i - 1];
          }

          const difference = progress - threshold;
          const actualProgress =
            difference > percentagePerPart ? 1 : difference / percentagePerPart;
          const addition = { x: x - start.x, y: y - start.y };

          ctx.lineTo(start.x + addition.x * actualProgress, start.y + addition.y * actualProgress);
        }
      } else {
        for (let i = 0; i < parts.length; i++) {
          const { x, y } = parts[i];

          if (i > 0) {
            start = parts[i - 1];

            ctx.moveTo(start.x, start.y);
          }

          const addition = { x: x - start.x, y: y - start.y };

          ctx.lineTo(start.x + addition.x * progress, start.y + addition.y * progress);
        }
      }

      ctx.stroke();
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

  ctx.fillText("0,0", startX - 20, startY - 10);
  ctx.fillText(`${oldStr.length},${newStr.length}`, endX + 20, endY + 10);
};
