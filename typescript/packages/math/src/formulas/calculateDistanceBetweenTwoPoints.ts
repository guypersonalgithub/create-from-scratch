import type { TwoDimensionalPoint } from "./types";

type CalculateDistanceBetweenTwoPointsArgs = {
  point1: TwoDimensionalPoint;
  point2: TwoDimensionalPoint;
};

export const calculateDistanceBetweenTwoPoints = ({
  point1,
  point2,
}: CalculateDistanceBetweenTwoPointsArgs) => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  const distance = Math.hypot(dx, dy);

  return { dx, dy, distance };
};
