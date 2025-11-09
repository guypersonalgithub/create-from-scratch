import { useState, useEffect, useRef, type ReactNode, type RefObject } from "react";
import { type TooltipDisplayProps } from "./types";
import {
  AnimationContainerUnmountWrapper,
  AnimationContainerWrapper,
  type AnimationContainerWrapperProps,
} from "@packages/animation-container";
import { capitalizeFirstChar } from "@packages/string-utils";
import { observeElementsVisibility } from "@packages/element-utils";
import type { CustomEdges, Edges } from "@packages/edge-intersection";
import { calculatePosition } from "@packages/calculate-relative-position";
import { dynatic } from "@packages/dynatic-css";

type TooltipManagerProps = Partial<
  Pick<AnimationContainerWrapperProps, "onMount" | "onUnmount" | "mountOptions" | "unmountOptions">
>;

export const TooltipManager = ({
  onMount,
  onUnmount,
  mountOptions,
  unmountOptions,
}: TooltipManagerProps) => {
  const [tooltips, setTooltips] = useState<TooltipDisplayProps[]>([]);
  const tooltipIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const showTooltip = (event: CustomEvent<TooltipDisplayProps>) => {
      const { id, content, ref, side, offset, intersectionRefs, distanceFromViewport } =
        event.detail;

      setTooltips((prev) => {
        const updated = [...prev];
        const index = prev.findIndex((tooltip) => tooltip.id === id);
        const tooltipContent = {
          id,
          content,
          ref,
          side,
          offset,
          intersectionRefs,
          distanceFromViewport,
        };
        if (index > -1) {
          updated[index] = tooltipContent;
        } else {
          updated.push(tooltipContent);
        }

        return updated;
      });
      tooltipIds.current.add(id);
    };

    const hideTooltip = (event: CustomEvent<TooltipDisplayProps>) => {
      const { id } = event.detail;

      if (!tooltipIds.current.has(id)) {
        return;
      }

      setTooltips((prev) => {
        const remainingTooltips = prev.filter((tooltip) => tooltip.id !== id);
        tooltipIds.current.delete(id);

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
    <AnimationContainerUnmountWrapper changeMethod="gradual">
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
              mountOptions={mountOptions ?? { duration: 300 }}
              unmountOptions={unmountOptions}
              className={dynatic`
                z-index: 1000;
                position: fixed;
              `}
              changeMethod="fullPhase"
              disableMountAnimationOnInit={false}
            >
              <TooltipBody
                key={id}
                anchorRef={ref}
                side={side}
                offset={offset}
                intersectionRefs={intersectionRefs}
                distanceFromViewport={distanceFromViewport}
                transitionDuration={
                  typeof mountOptions?.duration === "number" ? mountOptions?.duration : 300
                }
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

type TooltipBodyProps = Required<
  Pick<TooltipDisplayProps, "side" | "intersectionRefs" | "distanceFromViewport">
> &
  Pick<TooltipDisplayProps, "offset"> & {
    anchorRef?: RefObject<HTMLDivElement | null>;
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
}: TooltipBodyProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const opacity1 = dynatic`
      opacity: 1;
    `;

    const opacity0 = dynatic`
      opacity: 0;
    `;

    const refKey = (
      (offset?.x ?? offset?.y) ? `custom${capitalizeFirstChar({ str: side })}` : side
    ) as Edges | CustomEdges;

    const updateClassName = () => {
      if (!ref.current) {
        return;
      }

      const shouldReveal = calculatePosition({
        side,
        ref,
        intersectionRefs,
        refKey,
        distanceFromViewport,
      });

      if (shouldReveal) {
        ref.current.classList.remove(opacity0);
        ref.current.classList.add(opacity1);
      } else {
        ref.current.classList.remove(opacity1);
        ref.current.classList.add(opacity0);
      }
    };

    if (!anchorRef?.current) {
      return updateClassName();
    }

    const observer = observeElementsVisibility({
      elements: Object.values(intersectionRefs)
        .map((value) => {
          return value.current;
        })
        .filter((element) => element) as HTMLElement[],
      identificationCallback: ({ id }) => {
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

        updateClassName();
        window.addEventListener("scroll", updateClassName, true);
        window.addEventListener("resize", updateClassName);
      },
      removalCallback: () => {
        if (!ref.current) {
          return;
        }

        window.removeEventListener("scroll", updateClassName, true);
        window.removeEventListener("resize", updateClassName);

        ref.current.classList.remove(opacity1);
        ref.current.classList.add(opacity0);
      },
    });

    return () => {
      window.removeEventListener("scroll", updateClassName, true);
      window.removeEventListener("resize", updateClassName);
      observer.disconnect();
    };
  }, [intersectionRefs]);

  const duration = transitionDuration / 1000;

  return (
    <div
      ref={ref}
      className={dynatic`
        position: fixed;
        display: block;
        width: fit-content;
        height: fit-content;
        pointer-events: none;
        opacity: 0;
        clip-path: unset;
        left: -9999px;
        top: -9999px;
        transition: opacity ${duration}s ease, visibility ${duration}s ease;
        background-color: black;
        color: #fff;
        padding: 5px 10px;
        border-radius: 4px;
        word-wrap: break-word;
      `}
    >
      {children}
    </div>
  );
};
