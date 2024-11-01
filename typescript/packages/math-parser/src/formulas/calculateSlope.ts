import { TwoDimensionalPoint } from "./types";

type CalculateSlopeArgs = {
  point1: TwoDimensionalPoint;
  point2: TwoDimensionalPoint;
};

export const calculateSlope = ({ point1, point2 }: CalculateSlopeArgs) => {
  const { x: x1, y: y1 } = point1;
  const { x: x2, y: y2 } = point2;

  if (
    typeof x1 === "string" ||
    typeof y1 === "string" ||
    typeof x2 === "string" ||
    typeof y2 === "string"
  ) {
    throw new Error(
      "Currently unsupported calculation attempt of a slope with points that include variables or other identifiers",
    );
  }

  return (y2 - y1) / (x2 - x1);
};
