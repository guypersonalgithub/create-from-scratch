import { drawDiagonals } from "./drawDiagonals";
import { drawXLines } from "./drawXLines";
import { drawYLines } from "./drawYLines";
import { initializeBordersAndPoints } from "./initializeBordersAndPoints";
import type { Animation, Section } from "./types";

type DrawSectionsArgs = {
  ctx: CanvasRenderingContext2D;
  sections: Section[];
  oldStr: string;
  newStr: string;
  startX: number;
  startY: number;
  distanceX: number;
  distanceY: number;
  animation?: Animation;
};

export const drawSections = ({
  ctx,
  sections,
  oldStr,
  newStr,
  startX,
  startY,
  distanceX,
  distanceY,
  animation,
}: DrawSectionsArgs) => {
  sections.forEach((part) => {
    const { from, to } = part;
    const slicedOldStr = oldStr.slice(from.x, to.x);
    const slicedNewStr = newStr.slice(from.y, to.y);
    const partStartX = from.x * distanceX + startX;
    const partStartY = from.y * distanceY + startY;
    const partEndX = to.x * distanceX + startX;
    const partEndY = to.y * distanceY + startY;

    drawXLines({
      ctx,
      oldStr: slicedOldStr,
      startX: partStartX,
      startY: partStartY,
      distanceX,
      endY: partEndY,
      animation,
    });

    drawYLines({
      ctx,
      newStr: slicedNewStr,
      startX: partStartX,
      startY: partStartY,
      distanceY,
      endX: partEndX,
      animation,
    });

    drawDiagonals({
      ctx,
      oldStr: slicedOldStr,
      newStr: slicedNewStr,
      startX: partStartX,
      startY: partStartY,
      distanceX,
      distanceY,
      animation,
    });

    initializeBordersAndPoints({
      ctx,
      startX: partStartX,
      startY: partStartY,
      endX: partEndX,
      endY: partEndY,
      animation,
    });
  });
};
