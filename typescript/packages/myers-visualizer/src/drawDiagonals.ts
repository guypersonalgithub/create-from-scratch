import type { TwoDimensionalPoint } from "@packages/math";
import type { Animation } from "./types";
import { progressiveAnimate } from "@packages/request-animation-frame";
import { markAnimationDone } from "./markAnimationDone";

type DrawDiagonalsArgs = {
  ctx: CanvasRenderingContext2D;
  oldStr: string;
  newStr: string;
  startX: number;
  startY: number;
  distanceX: number;
  distanceY: number;
  animation?: Animation;
};

export const drawDiagonals = ({
  ctx,
  oldStr,
  newStr,
  startX,
  startY,
  distanceX,
  distanceY,
  animation,
}: DrawDiagonalsArgs) => {
  const diagonals: { from: TwoDimensionalPoint; to: TwoDimensionalPoint }[] = [];

  for (let i = 0; i < oldStr.length; i++) {
    const current = oldStr[i];

    for (let j = 0; j < newStr.length; j++) {
      const current2 = newStr[j];

      if (current === current2) {
        const x = distanceX * i + startX + 0.5;
        const y = distanceY * j + startY + 0.5;
        const endX = x + distanceX + 0.5;
        const endY = y + distanceY + 0.5;

        diagonals.push({ from: { x, y }, to: { x: endX, y: endY } });
      }
    }
  }

  if (!animation) {
    diagonals.forEach((diagonal) => {
      const { from, to } = diagonal;

      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.strokeStyle = "black";
      ctx.stroke();
    });
  } else {
    const { staggered, diagonalsDuration } = animation;
    const percentagePerPart = 1 / diagonals.length;

    const draw = ({ progress }: { progress: number }) => {
      ctx.beginPath();

      if (staggered) {
        for (let i = 0; i < diagonals.length; i++) {
          const threshold = i * percentagePerPart;

          if (threshold > progress) {
            break;
          }

          const { from, to } = diagonals[i];

          const difference = progress - threshold;
          const actualProgress =
            difference > percentagePerPart ? 1 : difference / percentagePerPart;
          const addition = { x: to.x - from.x, y: to.y - from.y };

          ctx.moveTo(from.x, from.y);
          ctx.lineTo(from.x + addition.x * actualProgress, from.y + addition.y * actualProgress);
        }
      } else {
        for (let i = 0; i < diagonals.length; i++) {
          const { from, to } = diagonals[i];
          const addition = { x: to.x - from.x, y: to.y - from.y };

          ctx.moveTo(from.x, from.y);
          ctx.lineTo(from.x + addition.x * progress, from.y + addition.y * progress);
        }
      }

      ctx.stroke();
    };

    let animationStart: number | null = null;

    requestAnimationFrame(
      progressiveAnimate({
        animationStart,
        callback: draw,
        animationDuration: diagonalsDuration,
        onEnd: markAnimationDone,
      }),
    );
  }
};
