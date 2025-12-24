import type { Trace } from "./types";

type CalculateMaxStepsArgs = {
  trace: Trace[];
};

export const calculateMaxSteps = ({ trace }: CalculateMaxStepsArgs) => {
  let min = trace[0].step,
    max = trace[0].step;

  for (let i = 1; i < trace.length; i++) {
    const current = trace[i];

    if (min > current.step) {
      min = current.step;
    }

    if (max < current.step) {
      max = current.step;
    }
  }

  return {
    min,
    max: max + 2, // steps always represent the start of the step, the end is always the step + 1, and we always want to include zero as the first step.
  };
};
