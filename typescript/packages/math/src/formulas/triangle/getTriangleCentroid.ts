import { calculateAverage } from "../calculateAverage";
import type { TwoDimensionalPoint } from "../types";

type GetTriangleCentroidArgs = {
  point1: TwoDimensionalPoint;
  point2: TwoDimensionalPoint;
  point3: TwoDimensionalPoint;
};

export const getTriangleCentroid = ({ point1, point2, point3 }: GetTriangleCentroidArgs) => {
  const x = calculateAverage({ data: [point1.x, point2.x, point3.x] });
  const y = calculateAverage({ data: [point1.y, point2.y, point3.y] });

  return { x, y };
};
