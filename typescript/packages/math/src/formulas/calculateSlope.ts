import { type TwoDimensionalPoint } from "./types";

type CalculateSlopeArgs = {
  point1: TwoDimensionalPoint;
  point2: TwoDimensionalPoint;
};

export const calculateSlope = ({ point1, point2 }: CalculateSlopeArgs) => {
  const { x: x1, y: y1 } = point1;
  const { x: x2, y: y2 } = point2;

  return (y2 - y1) / (x2 - x1);
};
