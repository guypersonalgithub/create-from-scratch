import { CSSProperties, ReactNode, useRef } from "react";
import { useControlTooltip } from "./useControlTooltip";
import { TooltipDisplayProps } from "./types";
import { TooltipContent } from "./TooltipContent";
import { useTooltipIntersectionRefs } from "./useTooltipIntersectionRefs";

export type TooltipProps = Pick<
  TooltipDisplayProps,
  "content" | "offset" | "side" | "distanceFromViewport"
> & {
  style?: CSSProperties;
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
  style,
  children,
}: TooltipProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { intersectionRefs } = useTooltipIntersectionRefs();
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

    hideTooltip();
  };

  return (
    <TooltipContent
      ref={ref}
      intersectionRefs={intersectionRefs}
      id={id}
      show={show}
      hide={hide}
      isEllipsizedCallback={isEllipsizedCallback}
      offset={offset}
      style={style}
    >
      {children}
    </TooltipContent>
  );
};
