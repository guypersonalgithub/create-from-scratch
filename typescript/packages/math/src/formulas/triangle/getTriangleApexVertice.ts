import { calculateDistanceBetweenTwoPoints } from "../calculateDistanceBetweenTwoPoints";
import type { TwoDimensionalPoint } from "../types";
import { getTriangleCentroid } from "./getTriangleCentroid";

type GetTriangleApexVerticeArgs = {
  vertices: TwoDimensionalPoint[];
};

// TODO: Isn't ideal if the apex is shorter than the vertices. Should be improved!
export const getTriangleApexVertice = ({ vertices }: GetTriangleApexVerticeArgs) => {
  const triangleCentroid = getTriangleCentroid({
    point1: vertices[0],
    point2: vertices[1],
    point3: vertices[2],
  });

  let apex = vertices[0];
  let maxDistance = calculateDistanceBetweenTwoPoints({
    point1: triangleCentroid,
    point2: vertices[0],
  }).distance;

  for (let i = 1; i < 3; i++) {
    const currentPoint = vertices[i];
    const distance = calculateDistanceBetweenTwoPoints({
      point1: triangleCentroid,
      point2: currentPoint,
    }).distance;

    if (distance > maxDistance) {
      apex = currentPoint;
      maxDistance = distance;
    }
  }

  return apex;
};
