import { useIntersectionRefs } from "@packages/edge-intersection";
import { type CSSProperties, type ReactNode, useRef } from "react";
import { useControlPopover } from "./useControlPopover";
import { type PopoverDisplayProps } from "./types";
import { PopoverContent } from "./PopoverContent";

export type PopoverProps = Pick<
  PopoverDisplayProps,
  "content" | "offset" | "side" | "distanceFromViewport"
> & {
  style?: CSSProperties;
  disabled?: boolean;
  children: ReactNode;
};

export const Popover = ({
  content,
  disabled,
  side,
  offset,
  distanceFromViewport,
  style,
  children,
}: PopoverProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { intersectionRefs } = useIntersectionRefs();
  const { id, showPopover, hidePopover } = useControlPopover();

  const isDisabled = disabled || !content;

  const show = () => {
    if (isDisabled) {
      return;
    }

    showPopover({
      content,
      ref,
      side,
      offset,
      intersectionRefs,
      distanceFromViewport,
    });
  };

  return (
    <PopoverContent
      ref={ref}
      intersectionRefs={intersectionRefs}
      id={id}
      show={show}
      offset={offset}
      style={style}
    >
      {children}
    </PopoverContent>
  );
};
