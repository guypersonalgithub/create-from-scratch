import { calculateDifferenceRange } from "./calculateDifferenceRange";
import { calculateMaxSteps } from "./calculateMaxSteps";
import type { Trace } from "./types";

type CalculateStepsAndDifferenceArgs = {
  trace: Trace[];
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

export const calculateStepsAndDifference = ({
  trace,
  startX,
  startY,
  endX,
  endY,
}: CalculateStepsAndDifferenceArgs) => {
  const steps = calculateMaxSteps({ trace });
  const stepsDifference = steps.max - steps.min;

  const differenceRange = calculateDifferenceRange({ trace });

  const distanceX = (endX - startX) / stepsDifference;
  const difference = Math.abs(differenceRange.min) + Math.abs(differenceRange.max) + 1; // including 0.
  const distanceY = (endY - startY) / difference;

  return {
    stepsDifference,
    differenceRange,
    distanceX,
    distanceY,
  };
};
