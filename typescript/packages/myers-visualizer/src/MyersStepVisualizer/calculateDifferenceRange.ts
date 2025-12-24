import type { Trace } from "./types";

type CalculateDifferencesArgs = {
  trace: Trace;
};

const calculateDifferences = ({ trace }: CalculateDifferencesArgs) => {
  const firstDifference = trace.from.x - trace.from.y;
  const secondDifference = trace.to.x - trace.to.y;
  const isFirstBigger = firstDifference > secondDifference;

  if (isFirstBigger) {
    return {
      min: secondDifference,
      max: firstDifference,
    };
  }

  return {
    min: firstDifference,
    max: secondDifference,
  };
};

type CalculateDifferenceRangeArgs = {
  trace: Trace[];
};

export const calculateDifferenceRange = ({ trace }: CalculateDifferenceRangeArgs) => {
  let { min, max } = calculateDifferences({ trace: trace[0] });

  for (let i = 1; i < trace.length; i++) {
    const { min: newMin, max: newMax } = calculateDifferences({ trace: trace[i] });

    if (newMin < min) {
        min = newMin;
    }

    if (newMax > max) {
        max = newMax;
    }
  }

  return { min, max };
};
