import { dynatic } from "@packages/dynatic-css";
import { useEffect, useRef } from "react";
import { scaleCanvasByDevicePixelRatio } from "@packages/canvas-utils";
import type { Animation, Connection, Highlight, Section } from "./types";
import { drawDiagonals } from "./drawDiagonals";
import { drawYLines } from "./drawYLines";
import { drawXLines } from "./drawXLines";
import { initializeBordersAndPoints } from "./initializeBordersAndPoints";
import { drawHighlights } from "./highlights/drawHighlights";
import { drawXLabels } from "./drawXLabels";
import { drawYLabels } from "./drawYLabels";
import { drawStartAndEndPoints } from "./drawStartAndEndPoints";
import { drawConnections } from "./drawConnections";
import { drawSections } from "./drawSections";

// TODO: Replace the eventListener callback with a localized callback, otherwise multiple component instances could trigger a single component's event.

type MyersCanvasProps = {
  className?: string;
  oldStr: string;
  newStr: string;
  highlights?: Highlight[];
  animation?: Animation;
  partial?: {
    sections: Section[];
    connections?: Connection[];
  };
};

export const MyersCanvas = ({
  className = dynatic`
    width: 500px;
    height: 500px;
  `,
  oldStr,
  newStr,
  highlights = [],
  animation,
  partial = { sections: [] },
}: MyersCanvasProps) => {
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

    initializeBordersAndPoints({ ctx, startX, startY, endX, endY, animation });
    drawStartAndEndPoints({ ctx, oldStr, newStr, startX, startY, endX, endY });

    const distanceX = (endX - startX) / oldStr.length;
    const distanceY = (endY - startY) / newStr.length;

    drawXLabels({ ctx, oldStr, startX, startY, distanceX, endY });
    drawYLabels({ ctx, newStr, startX, startY, distanceY, endX });

    const { sections, connections = [] } = partial;
    const isPartial = sections.length > 0;

    if (!isPartial) {
      drawXLines({ ctx, oldStr, startX, startY, distanceX, endY, animation });
      drawYLines({ ctx, newStr, startX, startY, distanceY, endX, animation });
      drawDiagonals({ ctx, oldStr, newStr, startX, startY, distanceX, distanceY, animation });
    } else {
      drawSections({
        ctx,
        sections,
        oldStr,
        newStr,
        startX,
        startY,
        distanceX,
        distanceY,
        animation,
      });
      drawConnections({ ctx, connections, startX, startY, distanceX, distanceY, animation });
    }

    if (!animation) {
      drawHighlights({ ctx, highlights, startX, startY, distanceX, distanceY });
    } else {
      let counter = 0;
      const triggerThreshold = !isPartial
        ? 4
        : 1 + sections.length * 4 + (connections.length > 0 ? 1 : 0);

      const animateHighlights = () => {
        counter++;

        if (counter === triggerThreshold) {
          drawHighlights({ ctx, highlights, startX, startY, distanceX, distanceY, animation });
        }
      };

      window.addEventListener(
        "finishedMyersVisualizerAnimationPart",
        animateHighlights as EventListener,
      );

      return () => {
        window.removeEventListener(
          "finishedMyersVisualizerAnimationPart",
          animateHighlights as EventListener,
        );
      };
    }
  }, [partial.sections.length]);

  return <canvas ref={ref} className={className} />;
};
