import { type CSSProperties, type ReactNode, useRef } from "react";
import { useControlTooltip } from "./useControlTooltip";
import { type TooltipDisplayProps } from "./types";
import { TooltipContent } from "./TooltipContent";
import { useIntersectionRefs } from "@packages/edge-intersection";

export type TooltipProps = Pick<
  TooltipDisplayProps,
  "content" | "offset" | "side" | "distanceFromViewport"
> & {
  className?: string;
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
  const { intersectionRefs } = useIntersectionRefs();
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
