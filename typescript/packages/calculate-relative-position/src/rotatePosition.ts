import { type RefObject } from "react";
import { type CustomEdges, type Edges, type EdgeWrapperRefs } from "@packages/edge-intersection";
import { positionCalculations } from "./positionCalculations";

type RotatePositionArgs = {
  side: Edges;
  ref: RefObject<HTMLDivElement | null>;
  intersectionRefs: EdgeWrapperRefs;
  refKey: Edges | CustomEdges;
};

export const rotatePosition = ({ side, ref, intersectionRefs, refKey }: RotatePositionArgs) => {
  const outOfViewport = isOutOfViewport({ ref });

  if (!outOfViewport) {
    return;
  }

  const isRotateX = outOfViewport === "rotateX";
  positionCalculations({
    side,
    ref,
    intersectionRefs,
    refKey,
    rotateX: isRotateX,
    rotateY: !isRotateX,
  });

  return !!isOutOfViewport({ ref });
};

type IsOutOfViewportArgs = {
  ref: RefObject<HTMLDivElement | null>;
};

const isOutOfViewport = ({ ref }: IsOutOfViewportArgs) => {
  const { left, top, width, height } = ref.current!.getBoundingClientRect();

  if (left < 0 || left + width > window.innerWidth) {
    return "rotateX";
  }

  if (top < 0 || top + height > window.innerHeight) {
    return "rotateY";
  }

  return;
};
