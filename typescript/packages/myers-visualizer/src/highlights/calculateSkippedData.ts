import {
  calculateAverage,
  calculateSlope,
  calculateSlopeBasedOffAngleAndAnotherSlopeBetweenLines,
} from "@packages/math";
import type { Highlight } from "../types";

type CalculateSkippedDataArgs = {
  distanceX: number;
  highlightStartX: number;
  highlightStartY: number;
  endX: number;
  endY: number;
} & Pick<Highlight, "from" | "to">;

export const calculateSkippedData = ({
  distanceX,
  from,
  to,
  highlightStartX,
  highlightStartY,
  endX,
  endY,
}: CalculateSkippedDataArgs) => {
  const highlightCenterX = calculateAverage({ data: [endX, highlightStartX] });
  const highlightCenterY = calculateAverage({ data: [endY, highlightStartY] });
  const existingSlope = calculateSlope({ point1: from, point2: to });
  const uncalculatableSlope = existingSlope === Infinity; // point1.x === point2.x

  const { caseA, caseB } = calculateSlopeBasedOffAngleAndAnotherSlopeBetweenLines({
    degree: 45,
    existingSlope: uncalculatableSlope ? 0 : existingSlope,
  });

  const firstX = highlightCenterX - distanceX / 10;
  const firstY = caseA * (firstX - highlightCenterX) + highlightCenterY;
  const secondX = highlightCenterX + distanceX / 10;
  const secondY = caseB * (secondX - highlightCenterX) + highlightCenterY;

  const firstEnd = caseA * (secondX - highlightCenterX) + highlightCenterY;
  const secondEnd = caseB * (firstX - highlightCenterX) + highlightCenterY;

  return { firstX, firstY, secondX, secondY, firstEnd, secondEnd };
};
