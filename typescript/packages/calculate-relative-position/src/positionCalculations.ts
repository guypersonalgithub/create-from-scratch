import {
  calculateBottom,
  calculateLeft,
  calculateMiddle,
  calculateRight,
  calculateTop,
} from "./sideCalculations";
import { RefObject } from "react";
import { CustomEdges, Edges, EdgeWrapperRefs } from "@packages/edge-intersection";

type PositionCalculationsArgs = {
  side: Edges;
  ref: RefObject<HTMLDivElement | null>;
  intersectionRefs: EdgeWrapperRefs;
  refKey: Edges | CustomEdges;
  rotateX?: boolean;
  rotateY?: boolean;
};

export const positionCalculations = ({
  side,
  ref,
  intersectionRefs,
  refKey,
  rotateX,
  rotateY,
}: PositionCalculationsArgs) => {
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
