import { createRef } from "react";
import { type EdgeWrapperRefs } from "@packages/edge-intersection";

export const useTooltipIntersectionRefs = () => {
  const intersectionRefs: EdgeWrapperRefs = {
    top: createRef(),
    topLeft: createRef(),
    topRight: createRef(),
    left: createRef(),
    bottom: createRef(),
    bottomLeft: createRef(),
    bottomRight: createRef(),
    right: createRef(),
    customTop: createRef(),
    customTopLeft: createRef(),
    customTopRight: createRef(),
    customLeft: createRef(),
    customBottom: createRef(),
    customBottomLeft: createRef(),
    customBottomRight: createRef(),
    customRight: createRef(),
  };

  return { intersectionRefs };
};
