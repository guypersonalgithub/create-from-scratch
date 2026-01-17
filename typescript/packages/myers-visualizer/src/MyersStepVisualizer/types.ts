import type { TwoDimensionalPoint } from "@packages/math";

export type Trace = {
  from: TwoDimensionalPoint;
  to: TwoDimensionalPoint;
  step: number;
  color?: string;
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
      xSecond?: number;
      yFirst: number;
      ySecond?: number;
      radius: number;
    };
  }) => void;
  drawRectangle: (props: {
    callback: (props: DrawTextArgs) => {
      x: number;
      y: number;
      height: number;
      width: number;
      color?: string;
    };
  }) => void;
  drawX: (props: {
    callback: (props: DrawTextArgs) => {
      from: TwoDimensionalPoint;
      to: TwoDimensionalPoint;
    };
  }) => void;
};

export type DrawTextArgs = {
  xPositions: Record<number, number>;
  yPositions: Record<number, number>;
};
