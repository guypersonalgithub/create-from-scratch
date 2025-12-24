import { type TwoDimensionalPoint } from "@packages/math";

export type Highlight = {
  from: TwoDimensionalPoint;
  to: TwoDimensionalPoint;
  skipped?: boolean;
  label?: string;
  color?: string;
};

export type Animation = {
  staggered?: boolean;
  borderDuration: number;
  axisDuration: number;
  diagonalsDuration: number;
  highlightsDuration: number;
};
