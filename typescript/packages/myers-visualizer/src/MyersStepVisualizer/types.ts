import type { TwoDimensionalPoint } from "@packages/math";

export type Trace = {
  from: TwoDimensionalPoint;
  to: TwoDimensionalPoint;
  step: number;
};

export type ExternalRefProps = {
  drawText: (props: {
    callback: (props: DrawTextArgs) => {
      xFirst: number;
      xSecond: number;
      yFirst: number;
      ySecond: number;
      text: string;
    };
  }) => void;
  drawCircle: (props: {
    callback: (props: DrawTextArgs) => {
      xFirst: number;
      xSecond: number;
      yFirst: number;
      ySecond: number;
      radius: number;
    };
  }) => void;
};

export type DrawTextArgs = {
  xPositions: Record<number, number>;
  yPositions: Record<number, number>;
};
