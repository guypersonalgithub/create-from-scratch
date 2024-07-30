import { ReactNode, useRef } from "react";
import "./styles.css";
import { useControlTooltip } from "./useControlTooltip";

export type TooltipProps = {
  content: ReactNode;
  disabled?: boolean;
  offset?: number;
  isEllipsizedCallback?: () => boolean;
  children: ReactNode;
};

export const Tooltip = ({
  content,
  disabled,
  offset,
  isEllipsizedCallback,
  children,
}: TooltipProps) => {
  const isHovered = useRef(false);
  const ref = useRef<HTMLDivElement>(null);
  const { showTooltip, hideTooltip } = useControlTooltip();

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
      offset,
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
    <div
      ref={ref}
      style={{ width: isEllipsizedCallback ? "inherit" : "fit-content", height: "fit-content" }}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {children}
    </div>
  );
};
