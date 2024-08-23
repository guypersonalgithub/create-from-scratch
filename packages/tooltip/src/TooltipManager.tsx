import { useState, useEffect, useRef, ReactNode, RefObject } from "react";
import { TooltipDisplayProps } from "./types";
import {
  AnimationContainerUnmountWrapper,
  AnimationContainerWrapper,
  AnimationContainerWrapperProps,
} from "@packages/animation-container";
import { capitalizeFirstChar, observeElementsVisibility } from "@packages/utils";
import { calculateTooltipPosition } from "./utils";
import type { CustomEdges, Edges } from "@packages/edge-intersection";

type TooltipManagerProps = Partial<
  Pick<AnimationContainerWrapperProps, "onMount" | "onUnmount" | "options">
>;
export const TooltipManager = ({ onMount, onUnmount, options }: TooltipManagerProps) => {
  const [tooltips, setTooltips] = useState<TooltipDisplayProps[]>([]);
  const tooltipIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const showTooltip = (event: CustomEvent<TooltipDisplayProps>) => {
      const { id, content, ref, side, offset, intersectionRefs, distanceFromViewport } =
        event.detail;
      if (tooltipIds.current.has(id)) {
        return;
      }

      setTooltips((prev) => [
        ...prev,
        { id, content, ref, side, offset, intersectionRefs, distanceFromViewport },
      ]);
      tooltipIds.current.add(id);
    };

    const hideTooltip = (event: CustomEvent<TooltipDisplayProps>) => {
      const { id } = event.detail;

      if (!tooltipIds.current.has(id)) {
        return;
      }

      tooltipIds.current.delete(id);
      setTooltips((prev) => {
        const remainingTooltips = prev.filter((tooltip) => tooltip.id !== id);
        tooltipIds.current = new Set();

        remainingTooltips.forEach((tooltip) => {
          tooltipIds.current.add(tooltip.id);
        });
        return remainingTooltips;
      });
    };

    window.addEventListener("showTooltip", showTooltip as EventListener);
    window.addEventListener("hideTooltip", hideTooltip as EventListener);

    return () => {
      window.removeEventListener("showTooltip", showTooltip as EventListener);
      window.removeEventListener("hideTooltip", hideTooltip as EventListener);
    };
  }, []);

  return (
    <AnimationContainerUnmountWrapper>
      {tooltips.map(
        ({
          id,
          content,
          ref,
          side = "top",
          offset,
          intersectionRefs,
          distanceFromViewport = 0,
        }) => {
          return (
            <AnimationContainerWrapper
              key={id}
              onMount={
                onMount ?? [
                  { opacity: 0, visibility: "hidden" },
                  { opacity: 1, visibility: "visible" },
                ]
              }
              onUnmount={onUnmount}
              options={options ?? { duration: 300 }}
            >
              <TooltipBody
                key={id}
                anchorRef={ref}
                side={side}
                offset={offset}
                intersectionRefs={intersectionRefs}
                distanceFromViewport={distanceFromViewport}
                transitionDuration={typeof options?.duration === "number" ? options?.duration : 300}
              >
                {content}
              </TooltipBody>
            </AnimationContainerWrapper>
          );
        },
      )}
    </AnimationContainerUnmountWrapper>
  );
};

type TestProps = Required<
  Pick<TooltipDisplayProps, "side" | "intersectionRefs" | "distanceFromViewport">
> &
  Pick<TooltipDisplayProps, "offset"> & {
    anchorRef?: RefObject<HTMLDivElement>;
    transitionDuration: number;
    children: ReactNode;
  };

const TooltipBody = ({
  anchorRef,
  side,
  offset,
  children,
  intersectionRefs,
  distanceFromViewport,
  transitionDuration,
}: TestProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const refKey = (
      offset?.x ?? offset?.y ? `custom${capitalizeFirstChar({ str: side })}` : side
    ) as Edges | CustomEdges;

    const updateStyle = () => {
      if (!ref.current) {
        return;
      }

      const shouldReveal = calculateTooltipPosition({
        side,
        ref,
        intersectionRefs,
        refKey,
        distanceFromViewport,
      });

      if (shouldReveal === "display") {
        ref.current.style.opacity = "1";
      } else {
        ref.current.style.opacity = "0";
      }
    };

    if (!anchorRef?.current) {
      return updateStyle();
    }

    const observer = observeElementsVisibility({
      elements: Object.values(intersectionRefs)
        .map((value) => {
          return value.current;
        })
        .filter((element) => element) as HTMLElement[],
      identificationCallback: (id) => {
        const [original, position] = id.split("-");

        if (!original || !position) {
          return false;
        }

        return position === refKey;
      },
      intersectionCallback: () => {
        if (!ref.current) {
          return;
        }

        updateStyle();
        window.addEventListener("scroll", updateStyle, true);
        window.addEventListener("resize", updateStyle);
      },
      removalCallback: () => {
        if (!ref.current) {
          return;
        }

        window.removeEventListener("scroll", updateStyle, true);
        window.removeEventListener("resize", updateStyle);

        ref.current.style.opacity = "0";
      },
    });

    return () => {
      window.removeEventListener("scroll", updateStyle, true);
      window.removeEventListener("resize", updateStyle);
      observer.disconnect();
    };
  }, [intersectionRefs]);

  const duration = transitionDuration / 1000;

  return (
    <div
      ref={ref}
      className="tooltip-box"
      style={{
        position: "fixed",
        display: "block",
        width: "fit-content",
        height: "fit-content",
        pointerEvents: "none",
        opacity: 0,
        clipPath: "unset",
        left: "-9999px",
        top: "-9999px",
        transition: `opacity ${duration}s ease, visibility ${duration}s ease`,
      }}
    >
      {children}
    </div>
  );
};
