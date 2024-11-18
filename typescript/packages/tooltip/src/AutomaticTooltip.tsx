import { useEffect, useRef } from "react";
import { useControlTooltip } from "./useControlTooltip";
import { TooltipContent } from "./TooltipContent";
import { useTooltipIntersectionRefs } from "./useTooltipIntersectionRefs";
import { TooltipProps } from "./Tooltip";

export const AutomaticTooltip = ({
  content,
  disabled,
  side,
  offset,
  distanceFromViewport,
  style,
  children,
}: Omit<TooltipProps, "isEllipsizedCallback">) => {
  const ref = useRef<HTMLDivElement>(null);
  const { intersectionRefs } = useTooltipIntersectionRefs();
  const { id, showTooltip, hideTooltip } = useControlTooltip();
  const isDisabled = disabled || !content;

  useEffect(() => {
    if (!isDisabled) {
      showTooltip({
        content,
        ref,
        side,
        offset,
        intersectionRefs,
        distanceFromViewport,
      });
    } else {
      hideTooltip();
    }
  }, [isDisabled]);

  return (
    <TooltipContent ref={ref} intersectionRefs={intersectionRefs} id={id} style={style}>
      {children}
    </TooltipContent>
  );
};
