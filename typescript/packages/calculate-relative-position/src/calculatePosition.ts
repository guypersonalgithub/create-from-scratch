import { RefObject } from "react";
import { CustomEdges, Edges, EdgeWrapperRefs } from "@packages/edge-intersection";
import { getSidesOrder } from "./getSidesOrder";
import { positionCalculations } from "./positionCalculations";
import { rotatePosition } from "./rotatePosition";

type CalculatePositionArgs = {
  side: Edges;
  distanceFromViewport: number;
  ref: RefObject<HTMLDivElement | null>;
  intersectionRefs: EdgeWrapperRefs;
  refKey: Edges | CustomEdges;
  skipDistance?: boolean;
};

export const calculatePosition = ({
  side,
  ref,
  intersectionRefs,
  refKey,
  distanceFromViewport,
  skipDistance,
}: CalculatePositionArgs) => {
  if (!ref.current) {
    return false;
  }

  const sideOrder = getSidesOrder({ side });

  for (const side of sideOrder) {
    positionCalculations({
      side,
      ref,
      intersectionRefs,
      refKey,
    });

    const isOutOfViewport = rotatePosition({
      side,
      ref,
      intersectionRefs,
      refKey,
    });

    if (!isOutOfViewport) {
      if (!skipDistance) {
        maintainReceivedDistance({ side, ref, intersectionRefs, refKey, distanceFromViewport });
      }
      return true;
    }
  }

  return false;
};

const maintainReceivedDistance = ({
  side,
  ref,
  intersectionRefs,
  refKey,
  distanceFromViewport,
}: Omit<CalculatePositionArgs, "skipDistance">) => {
  const { left, top, width, height } = ref.current!.getBoundingClientRect();

  let sizesWereChanged = false;

  if (left === 0 || left + width === window.innerWidth) {
    ref.current!.style.maxWidth = `${width - distanceFromViewport}px`;
    sizesWereChanged = true;
  }

  if (top === 0 || top + height === window.innerHeight) {
    ref.current!.style.maxHeight = `${height - distanceFromViewport}px`;
    sizesWereChanged = true;
  }

  if (!sizesWereChanged) {
    return;
  }

  calculatePosition({
    side,
    ref,
    intersectionRefs,
    refKey,
    distanceFromViewport,
    skipDistance: true,
  });
};
