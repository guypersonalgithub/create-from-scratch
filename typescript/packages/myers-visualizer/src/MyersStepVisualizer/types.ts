import type { TwoDimensionalPoint } from "@packages/math";

export type Trace = {
  from: TwoDimensionalPoint;
  to: TwoDimensionalPoint;
  step: number;
};
