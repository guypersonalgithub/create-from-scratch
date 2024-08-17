import { RefObject } from "react";
import { TooltipDisplayProps } from "./types";
import { CustomEdges, Edges, EdgeWrapperRefs } from "@packages/edge-intersection";

type CalculateTooltipPositionArgs = Required<
  Pick<TooltipDisplayProps, "side" | "distanceFromViewport">
> & {
  ref: RefObject<HTMLDivElement>;
  intersectionRefs: EdgeWrapperRefs;
  refKey: Edges | CustomEdges;
  skipDistance?: boolean;
};

export const calculateTooltipPosition = ({
  side,
  ref,
  intersectionRefs,
  refKey,
  distanceFromViewport,
  skipDistance,
}: CalculateTooltipPositionArgs) => {
  if (!ref.current) {
    return "hide";
  }

  const sideOrder = getSidesOrder({ side });

  for (const side of sideOrder) {
    positionCalculations({
      side,
      ref,
      intersectionRefs,
      refKey,
    });

    const isOutOfViewport = rotateTooltipPosition({
      side,
      ref,
      intersectionRefs,
      refKey,
    });

    if (!isOutOfViewport) {
      if (!skipDistance) {
        maintainReceivedDistance({ side, ref, intersectionRefs, refKey, distanceFromViewport });
      }
      return "display";
    }
  }

  return "hide";
};

const positionCalculations = ({
  side,
  ref,
  intersectionRefs,
  refKey,
  rotateX,
  rotateY,
}: Omit<CalculateTooltipPositionArgs, "distanceFromViewport" | "skipDistance"> & {
  rotateX?: boolean;
  rotateY?: boolean;
}) => {
  const {
    left: edgeLeft = 0,
    right: edgeRight = 0,
    top: edgeTop = 0,
    bottom: edgeBottom = 0,
    width: edgeWidth = 0,
  } = intersectionRefs[refKey]?.current?.getBoundingClientRect() ?? {};
  const { width, height } = ref.current!.getBoundingClientRect();

  if (side === "bottom" || side === "bottomLeft" || side === "bottomRight") {
    !rotateY
      ? calculateBottom({ ref, edgeBottom })
      : calculateTop({ ref, edgeTop: edgeBottom, height });

    if (side === "bottom") {
      calculateMiddle({ ref, edgeLeft, edgeWidth, width });
    } else if (side === "bottomLeft") {
      !rotateX
        ? calculateLeft({ ref, edgeLeft, width })
        : calculateRight({ ref, edgeRight: edgeLeft });
    } else if (side === "bottomRight") {
      !rotateX
        ? calculateRight({ ref, edgeRight })
        : calculateLeft({ ref, edgeLeft: edgeRight, width });
    }
  } else if (side === "top" || side === "topLeft" || side === "topRight") {
    !rotateY
      ? calculateTop({ ref, edgeTop, height })
      : calculateBottom({ ref, edgeBottom: edgeTop });

    if (side === "top") {
      calculateMiddle({ ref, edgeLeft, edgeWidth, width });
    } else if (side === "topLeft") {
      !rotateX
        ? calculateLeft({ ref, edgeLeft, width })
        : calculateRight({ ref, edgeRight: edgeLeft });
    } else if (side === "topRight") {
      !rotateX
        ? calculateRight({ ref, edgeRight })
        : calculateLeft({ ref, edgeLeft: edgeRight, width });
    }
  } else {
    !rotateY
      ? calculateTop({ ref, edgeTop, height })
      : calculateBottom({ ref, edgeBottom: edgeTop });

    if (side === "right") {
      !rotateX
        ? calculateRight({ ref, edgeRight })
        : calculateLeft({ ref, edgeLeft: edgeRight, width });
    } else {
      !rotateX
        ? calculateLeft({ ref, edgeLeft, width })
        : calculateRight({ ref, edgeRight: edgeLeft });
    }
  }
};

const rotateTooltipPosition = ({
  side,
  ref,
  intersectionRefs,
  refKey,
}: Omit<CalculateTooltipPositionArgs, "distanceFromViewport" | "skipDistance">) => {
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

const maintainReceivedDistance = ({
  side,
  ref,
  intersectionRefs,
  refKey,
  distanceFromViewport,
}: Omit<CalculateTooltipPositionArgs, "skipDistance">) => {
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

  calculateTooltipPosition({
    side,
    ref,
    intersectionRefs,
    refKey,
    distanceFromViewport,
    skipDistance: true,
  });
};

type CalculateLeftArgs = {
  ref: RefObject<HTMLDivElement>;
  edgeLeft: number;
  width: number;
};

const calculateLeft = ({ ref, edgeLeft, width }: CalculateLeftArgs) => {
  ref.current!.style.left = `${edgeLeft - width}px`;
};

type CalculateRightArgs = {
  ref: RefObject<HTMLDivElement>;
  edgeRight: number;
};

const calculateRight = ({ ref, edgeRight }: CalculateRightArgs) => {
  ref.current!.style.left = `${edgeRight}px`;
};

type CalculateMiddleArgs = {
  ref: RefObject<HTMLDivElement>;
  edgeLeft: number;
  edgeWidth: number;
  width: number;
};

const calculateMiddle = ({ ref, edgeLeft, edgeWidth, width }: CalculateMiddleArgs) => {
  const centerPoint = edgeLeft + edgeWidth / 2;
  const leftPosition = centerPoint - width / 2;
  ref.current!.style.left = `${leftPosition}px`;
};

type CalculateBottomArgs = {
  ref: RefObject<HTMLDivElement>;
  edgeBottom: number;
};

const calculateBottom = ({ ref, edgeBottom }: CalculateBottomArgs) => {
  ref.current!.style.top = `${edgeBottom}px`;
};

type CalculateTopArgs = {
  ref: RefObject<HTMLDivElement>;
  edgeTop: number;
  height: number;
};

const calculateTop = ({ ref, edgeTop, height }: CalculateTopArgs) => {
  ref.current!.style.top = `${edgeTop - height}px`;
};

type IsOutOfViewportArgs = {
  ref: RefObject<HTMLDivElement>;
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

type GetSidesOrderArgs = Pick<CalculateTooltipPositionArgs, "side">;

const getSidesOrder = ({ side }: GetSidesOrderArgs): Edges[] => {
  if (side === "top") {
    return ["top", "topLeft", "topRight", "bottom", "bottomLeft", "bottomRight", "left", "right"];
  }

  if (side === "topLeft") {
    return ["topLeft", "top", "topRight", "bottom", "bottomLeft", "bottomRight", "left", "right"];
  }

  if (side === "topRight") {
    return ["topRight", "top", "topLeft", "bottom", "bottomLeft", "bottomRight", "left", "right"];
  }

  if (side === "bottom") {
    return ["bottom", "bottomLeft", "bottomRight", "top", "topLeft", "topRight", "left", "right"];
  }

  if (side === "bottomLeft") {
    return ["bottomLeft", "bottom", "bottomRight", "top", "topLeft", "topRight", "left", "right"];
  }

  if (side === "bottomRight") {
    return ["bottomRight", "bottom", "bottomLeft", "top", "topLeft", "topRight", "left", "right"];
  }

  if (side === "left") {
    return ["left", "topLeft", "bottomLeft", "right", "topRight", "bottomRight", "top", "bottom"];
  }

  return ["right", "topRight", "bottomRight", "left", "topLeft", "bottomLeft", "top", "bottom"];
};
