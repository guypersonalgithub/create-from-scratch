import { createRef, ReactNode, useRef } from "react";
import { useControlTooltip } from "./useControlTooltip";
import { EdgeIntersection, type EdgeWrapperRefs } from "@packages/edge-intersection";
import { TooltipDisplayProps } from "./types";

export type TooltipProps = Pick<
  TooltipDisplayProps,
  "content" | "offset" | "side" | "distanceFromViewport"
> & {
  disabled?: boolean;
  isEllipsizedCallback?: () => boolean;
  children: ReactNode;
};

export const Tooltip = ({
  content,
  disabled,
  side,
  offset,
  isEllipsizedCallback,
  distanceFromViewport,
  children,
}: TooltipProps) => {
  const isHovered = useRef(false);
  const ref = useRef<HTMLDivElement>(null);
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
  const { id, showTooltip, hideTooltip } = useControlTooltip();

  const disableTooltipBecauseOfEllipsis = () => {
    if (!isEllipsizedCallback) {
      return false;
    }

    return !isEllipsizedCallback();
  };

  const isDisabled = disabled || !content;

  const show = () => {
    if (isDisabled || disableTooltipBecauseOfEllipsis()) {
      return;
    }

    isHovered.current = true;

    showTooltip({
      content,
      ref,
      side,
      offset,
      intersectionRefs,
      distanceFromViewport,
    });
  };

  const hide = () => {
    if (isDisabled || disableTooltipBecauseOfEllipsis()) {
      return;
    }

    isHovered.current = false;

    hideTooltip();
  };

  return (
    <EdgeIntersection
      id={id}
      style={{ width: isEllipsizedCallback ? "inherit" : "fit-content", height: "fit-content" }}
      intersectionRefs={intersectionRefs}
      offset={offset}
    >
      <div
        ref={ref}
        style={{
          width: isEllipsizedCallback ? "inherit" : "fit-content",
          height: "fit-content",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        onMouseEnter={show}
        onMouseLeave={hide}
      >
        {children}
      </div>
    </EdgeIntersection>
  );
};
