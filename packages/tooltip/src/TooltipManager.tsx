import { useState, useEffect, useRef } from "react";
import { TooltipDisplayProps } from "./types";
import {
  AnimationContainerWrapper,
  AnimationContainerWrapperProps,
} from "@packages/animation-container";

type TooltipManagerProps = Partial<Pick<AnimationContainerWrapperProps, "keyframes" | "options">>;

export const TooltipManager = ({ keyframes, options }: TooltipManagerProps) => {
  const [tooltips, setTooltips] = useState<TooltipDisplayProps[]>([]);
  const tooltipIds = useRef<Set<string>>(new Set());
  const [disableTooltips, setDisableTooltips] = useState<boolean>(false);

  useEffect(() => {
    const showTooltip = (event: CustomEvent<TooltipDisplayProps>) => {
      const { id, content, ref, offset } = event.detail;
      if (tooltipIds.current.has(id)) {
        return;
      }

      setTooltips((prev) => [...prev, { id, content, ref, offset }]);
      tooltipIds.current.add(id);
      setDisableTooltips(false);
    };

    const hideTooltip = (event: CustomEvent<TooltipDisplayProps>) => {
      const { id } = event.detail;

      if (!tooltipIds.current.has(id)) {
        return;
      }

      tooltipIds.current.delete(id);
      setTooltips((prev) => {
        const tooltipIndex = prev.findIndex((tooltip) => tooltip.id === id);
        if (tooltipIndex === -1) {
          return prev;
        }

        tooltipIds.current = new Set();
        if (tooltipIndex === 0) {
          return [];
        }

        const remainingTooltips = prev.slice(0, tooltipIndex);
        remainingTooltips.forEach((tooltip) => {
          tooltipIds.current.add(tooltip.id);
        });
        return remainingTooltips;
      });
    };

    const updateTooltipsStyleOnChange = () => {
      setTooltips([]);
      setDisableTooltips(true);
    };

    window.addEventListener("showTooltip", showTooltip as EventListener);
    window.addEventListener("hideTooltip", hideTooltip as EventListener);
    window.addEventListener("resize", updateTooltipsStyleOnChange);

    return () => {
      window.removeEventListener("showTooltip", showTooltip as EventListener);
      window.removeEventListener("hideTooltip", hideTooltip as EventListener);
      window.removeEventListener("resize", updateTooltipsStyleOnChange);
    };
  }, []);

  if (disableTooltips) {
    return null;
  }

  return (
    <AnimationContainerWrapper
      keyframes={
        keyframes ?? [
          { opacity: 0, visibility: "hidden" },
          { opacity: 1, visibility: "visible" },
        ]
      }
      options={options ?? { duration: 300 }}
    >
      {tooltips.map(({ id, content, ref, offset = 0 }) => {
        const {
          left = 0,
          top = 0,
          right = 0,
          bottom = 0,
        } = ref.current?.getBoundingClientRect() ?? {};
        const style = {
          top: window.scrollY + (top + bottom) / 2 - 40 + offset,
          left: window.scrollX + (left + right) / 2,
        };

        return (
          <div
            key={id}
            className="tooltip-box"
            style={{
              ...style,
              position: "absolute",
              display: "block",
              width: "fit-content",
              height: "fit-content",
            }}
          >
            {content}
          </div>
        );
      })}
    </AnimationContainerWrapper>
  );
};
