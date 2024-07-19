import { useState, useEffect } from "react";
import { TooltipDisplayProps } from "./types";
import { AnimationContainerWrapper } from "@packages/animation-container";
import { AnimationContainerWrapperProps } from "@packages/animation-container/src/AnimationContainerWrapper/types";

type TooltipManagerProps = Partial<Pick<AnimationContainerWrapperProps, "from" | "to" | "options">>;

export const TooltipManager = ({ from, to, options }: TooltipManagerProps) => {
  const [tooltips, setTooltips] = useState<TooltipDisplayProps[]>([]);
  const [disableTooltips, setDisableTooltips] = useState<boolean>(false);

  useEffect(() => {
    const showTooltip = (event: CustomEvent<TooltipDisplayProps>) => {
      const { id, content, ref, offset } = event.detail;

      setTooltips((prev) => [...prev, { id, content, ref, offset }]);
      setDisableTooltips(false);
    };

    const hideTooltip = (event: CustomEvent<TooltipDisplayProps>) => {
      const { id } = event.detail;
      setTooltips((prev) => {
        const tooltipIndex = prev.findIndex((tooltip) => tooltip.id === id);
        if (tooltipIndex === 0) {
          return [];
        }

        return prev.slice(0, tooltipIndex);
      });
    };

    const updateTooltipsStyleOnChange = () => {
      setTooltips([]);
      setDisableTooltips(true);
    };

    window.addEventListener("showTooltip", showTooltip as EventListener);
    window.addEventListener("hideTooltip", hideTooltip as EventListener);
    // window.addEventListener("scroll", updateTooltipsStyleOnChange);
    window.addEventListener("resize", updateTooltipsStyleOnChange);

    return () => {
      window.removeEventListener("showTooltip", showTooltip as EventListener);
      window.removeEventListener("hideTooltip", hideTooltip as EventListener);
      // window.removeEventListener("scroll", updateTooltipsStyleOnChange);
      window.removeEventListener("resize", updateTooltipsStyleOnChange);
    };
  }, []);

  if (disableTooltips) {
    return null;
  }

  return (
    <AnimationContainerWrapper
      from={from ?? { opacity: 0, visibility: "hidden" }}
      to={to ?? { opacity: 1, visibility: "visible" }}
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
