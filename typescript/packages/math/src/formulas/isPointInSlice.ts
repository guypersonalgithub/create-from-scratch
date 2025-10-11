import { calculateDistanceBetweenTwoPoints } from "./calculateDistanceBetweenTwoPoints";
import { convertRadiansToDegree } from "./convertRadiansToDegree";
import { isAngleBetweenInCircle } from "./isAngleBetweenInCircle";
import type { TwoDimensionalPoint } from "./types";

type IsPointInSliceArgs = {
  point: TwoDimensionalPoint;
  circleCenter: TwoDimensionalPoint;
  radius: number;
  startAngle: number;
  endAngle: number;
};

export const isPointInSlice = ({
  point,
  circleCenter,
  radius,
  startAngle,
  endAngle,
}: IsPointInSliceArgs) => {
  const { dx, dy, distance } = calculateDistanceBetweenTwoPoints({
    point1: point,
    point2: circleCenter,
  });

  if (distance > radius) {
    return false;
  }

  const angleRadians = Math.atan2(dy, dx);
  const angle = convertRadiansToDegree({ radians: angleRadians });

  return isAngleBetweenInCircle({ angle, start: startAngle, end: endAngle });
};
