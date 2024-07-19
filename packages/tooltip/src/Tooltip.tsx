import { ReactNode, useRef } from "react";
import "./styles.css";
import { hideTooltip, showTooltip } from "./utils";

type TooltipProps = {
  content: ReactNode;
  disabled?: boolean;
  offset?: number;
  children: ReactNode;
};

export const Tooltip = ({ content, disabled, offset, children }: TooltipProps) => {
  const isHovered = useRef(false);
  const ref = useRef<HTMLDivElement>(null);
  const isDisabled = disabled || !content;

  const show = () => {
    if (isDisabled) {
      return;
    }

    isHovered.current = true;

    showTooltip({
      id: "tooltip-1",
      content,
      ref,
      offset,
    });
  };
  const hide = () => {
    if (isDisabled) {
      return;
    }

    isHovered.current = false;

    hideTooltip({ id: "tooltip-1" });
  };

  return (
    <div ref={ref} onMouseEnter={show} onMouseLeave={hide}>
      {children}
    </div>
  );
};
