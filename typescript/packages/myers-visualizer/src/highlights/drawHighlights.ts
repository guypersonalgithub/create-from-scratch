import { progressiveAnimate } from "@packages/request-animation-frame";
import type { Animation, Highlight } from "../types";
import { drawHighlightEnd } from "./drawHighlightEnd";
import { drawLabel } from "./drawLabel";
import { drawSkippedX } from "./drawSkippedX";
import { calculateHighlightData } from "./calculateHighlightData";

// TODO: Create a non staggered animation

const END_OF_HIGHLIGHT_START_ANGLE = 60;

type DrawHighlightsArgs = {
  ctx: CanvasRenderingContext2D;
  highlights: Highlight[];
  startX: number;
  startY: number;
  distanceX: number;
  distanceY: number;
  animation?: Animation;
};

export const drawHighlights = ({
  ctx,
  highlights,
  startX,
  startY,
  distanceX,
  distanceY,
  animation,
}: DrawHighlightsArgs) => {
  ctx.strokeStyle = "green";
  ctx.fillStyle = "green";
  ctx.font = "bold 12px Arial";

  const calculated = highlights.map((highlight) => {
    return calculateHighlightData({ highlight, startX, startY, distanceX, distanceY });
  });

  if (!animation) {
    for (let i = 0; i < calculated.length; i++) {
      const current = calculated[i];
      const {
        skipped,
        label,
        color,
        highlightStartX,
        highlightStartY,
        endX,
        endY,
        firstX,
        firstY,
        secondX,
        secondY,
        firstEnd,
        secondEnd,
      } = current;

      if (color) {
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
      } else {
        ctx.strokeStyle = "green";
        ctx.fillStyle = "green";
      }

      if (skipped) {
        ctx.strokeStyle = color ?? "red";
        ctx.fillStyle = color ?? "red";
      }

      ctx.beginPath();
      ctx.moveTo(highlightStartX, highlightStartY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      drawHighlightEnd({ ctx, x: endX, y: endY, radius: 3 });

      if (label) {
        drawLabel({ ctx, label, highlightStartX, highlightStartY });
      }

      if (skipped) {
        drawSkippedX({ ctx, firstX, firstY, secondX, secondY, firstEnd, secondEnd });

        ctx.strokeStyle = color ?? "green";
        ctx.fillStyle = color ?? "green";
      }
    }
  } else {
    const { staggered, highlightsDuration } = animation;

    let itemsLength = highlights.length;

    const improvedCalculated = calculated.map((highlight) => {
      const { endX, highlightStartX, endY, highlightStartY } = highlight;

      return { ...highlight, addition: { x: endX - highlightStartX, y: endY - highlightStartY } };
    });

    const percentagePerPart = 1 / itemsLength;
    let currentIndex = 0;

    const draw = ({
      progress,
      highlightData,
    }: {
      progress: number;
      highlightData: (typeof improvedCalculated)[number];
    }) => {
      const {
        skipped,
        label,
        highlightStartX,
        highlightStartY,
        endX,
        endY,
        addition,
        firstX,
        firstY,
        secondX,
        secondY,
        firstEnd,
        secondEnd,
      } = highlightData;

      if (skipped) {
        ctx.strokeStyle = "red";
        ctx.fillStyle = "red";
      }

      const arcPart = 0.1;
      const linePart = skipped ? 0.6 : 0.9;
      const beyondLineThreshold = progress > linePart;
      const actualLineProgress = beyondLineThreshold ? 1 : progress / linePart;

      ctx.beginPath();
      ctx.moveTo(highlightStartX, highlightStartY);
      ctx.lineTo(
        highlightStartX + addition.x * actualLineProgress,
        highlightStartY + addition.y * actualLineProgress,
      );
      ctx.stroke();

      if (!beyondLineThreshold) {
        return;
      }

      const completeArcThreshold = linePart + arcPart;
      const arcDifference = progress - completeArcThreshold;
      const beyondArcThreshold = arcDifference >= 0;
      const actualArcProgress = beyondArcThreshold ? 1 : arcDifference / arcPart;

      drawHighlightEnd({
        ctx,
        x: endX,
        y: endY,
        radius: 3,
        startAngle: END_OF_HIGHLIGHT_START_ANGLE,
        endAngle: Math.PI * 2 * actualArcProgress + END_OF_HIGHLIGHT_START_ANGLE,
      });

      if (!beyondArcThreshold) {
        return;
      }

      if (label) {
        drawLabel({ ctx, label, highlightStartX, highlightStartY });
      }

      if (skipped) {
        const skipPart = 1 - completeArcThreshold;
        const halfSkipPart = skipPart / 2;
        const halfSkipDifference = progress - completeArcThreshold;
        const beyondHalfSkipThreshold = halfSkipDifference > halfSkipPart;
        const actualHalfSkipProgress = beyondHalfSkipThreshold
          ? 1
          : halfSkipDifference / halfSkipPart;
        const firstHalfAddition = { x: secondX - firstX, y: firstEnd - firstY };

        ctx.beginPath();
        ctx.moveTo(firstX, firstY);
        ctx.lineTo(
          firstX + firstHalfAddition.x * actualHalfSkipProgress,
          firstY + firstHalfAddition.y * actualHalfSkipProgress,
        );
        ctx.stroke();

        if (beyondHalfSkipThreshold) {
          const halfSkipThreshold = completeArcThreshold + halfSkipPart;
          const finalDifference = progress - halfSkipThreshold;
          const beyondFinalThreshold = finalDifference >= halfSkipPart;
          const actualFinalProgress = beyondFinalThreshold ? 1 : finalDifference / halfSkipPart;
          const finalAddition = { x: firstX - secondX, y: secondEnd - secondY };

          ctx.beginPath();
          ctx.moveTo(secondX, secondY);
          ctx.lineTo(
            secondX + finalAddition.x * actualFinalProgress,
            secondY + finalAddition.y * actualFinalProgress,
          );
          ctx.stroke();

          if (beyondFinalThreshold) {
            ctx.strokeStyle = "green";
            ctx.fillStyle = "green";
          }
        }
      }
    };

    const onEnd = () => {
      currentIndex++;

      if (currentIndex >= improvedCalculated.length) {
        return;
      }

      let animationStart: number | null = null;

      requestAnimationFrame(
        progressiveAnimate({
          animationStart,
          callback: ({ progress }) =>
            draw({ progress, highlightData: improvedCalculated[currentIndex] }),
          animationDuration: highlightsDuration,
          onEnd,
        }),
      );
    };

    let animationStart: number | null = null;

    requestAnimationFrame(
      progressiveAnimate({
        animationStart,
        callback: ({ progress }) =>
          draw({ progress, highlightData: improvedCalculated[currentIndex] }),
        animationDuration: highlightsDuration,
        onEnd,
      }),
    );
  }
};
