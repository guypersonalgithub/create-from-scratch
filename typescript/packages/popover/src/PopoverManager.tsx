import { useState, useEffect, useRef, type RefObject, type ReactNode } from "react";
import { type PopoverDisplayProps } from "./types";
import {
  AnimationContainerUnmountWrapper,
  AnimationContainerWrapper,
  type AnimationContainerWrapperProps,
} from "@packages/animation-container";
import { capitalizeFirstChar, combineStringsWithSpaces } from "@packages/string-utils";
import { observeElementsVisibility } from "@packages/element-utils";
import type { CustomEdges, Edges } from "@packages/edge-intersection";
import { calculatePosition } from "@packages/calculate-relative-position";
import { dynatic } from "@packages/dynatic-css";

type PopoverManagerProps = Partial<
  Pick<AnimationContainerWrapperProps, "onMount" | "onUnmount" | "mountOptions" | "unmountOptions">
>;

export const PopoverManager = ({
  onMount,
  onUnmount,
  mountOptions,
  unmountOptions,
}: PopoverManagerProps) => {
  const [popovers, setPopovers] = useState<PopoverDisplayProps[]>([]);
  const popoverIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const showPopover = (event: CustomEvent<PopoverDisplayProps>) => {
      const {
        id,
        content,
        ref,
        side,
        offset,
        intersectionRefs,
        distanceFromViewport,
        className,
        style,
      } = event.detail;

      setPopovers((prev) => {
        const updated = [...prev];
        const index = prev.findIndex((popover) => popover.id === id);
        const popoverContent = {
          id,
          content,
          ref,
          side,
          offset,
          intersectionRefs,
          distanceFromViewport,
          className,
          style,
        };
        if (index > -1) {
          updated[index] = popoverContent;
        } else {
          updated.push(popoverContent);
        }

        return updated;
      });
      popoverIds.current.add(id);
    };

    const hidePopover = (event: CustomEvent<PopoverDisplayProps>) => {
      const { id } = event.detail;

      if (!popoverIds.current.has(id)) {
        return;
      }

      setPopovers((prev) => {
        const remainingPopovers = prev.filter((popover) => popover.id !== id);
        popoverIds.current = new Set();

        remainingPopovers.forEach((popover) => {
          popoverIds.current.add(popover.id);
        });

        return remainingPopovers;
      });
    };

    window.addEventListener("showPopover", showPopover as EventListener);
    window.addEventListener("hidePopover", hidePopover as EventListener);

    return () => {
      window.removeEventListener("showPopover", showPopover as EventListener);
      window.removeEventListener("hidePopover", hidePopover as EventListener);
    };
  }, []);

  return (
    <AnimationContainerUnmountWrapper changeMethod="gradual">
      {popovers.map(
        ({
          id,
          content,
          ref,
          side = "bottom",
          offset,
          intersectionRefs,
          distanceFromViewport = 0,
          className,
          style,
        }) => {
          const hidePopover = () =>
            setPopovers((prev) => {
              const remainingPopovers = prev.filter((popover) => popover.id !== id);
              popoverIds.current.delete(id);

              return remainingPopovers;
            });

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
                position: absolute;
                top: 0;
                z-index: 10000;  
              `}
              changeMethod="fullPhase"
              disableMountAnimationOnInit={false}
            >
              <div key={id}>
                <div
                  className={dynatic`
                    position: absolute;
                    width: 100vw;
                    height: 100vh;
                  `}
                  onClick={hidePopover}
                />
                <PopoverBody
                  anchorRef={ref}
                  side={side}
                  offset={offset}
                  intersectionRefs={intersectionRefs}
                  distanceFromViewport={distanceFromViewport}
                  transitionDuration={
                    typeof mountOptions?.duration === "number" ? mountOptions?.duration : 300
                  }
                  className={className}
                  style={style}
                >
                  {typeof content === "function" ? content({ hidePopover }) : content}
                </PopoverBody>
              </div>
            </AnimationContainerWrapper>
          );
        },
      )}
    </AnimationContainerUnmountWrapper>
  );
};

type PopoverBodyProps = Required<
  Pick<PopoverDisplayProps, "side" | "intersectionRefs" | "distanceFromViewport">
> &
  Pick<PopoverDisplayProps, "offset" | "className" | "style"> & {
    anchorRef?: RefObject<HTMLDivElement | null>;
    transitionDuration: number;
    children: ReactNode;
  };

const PopoverBody = ({
  anchorRef,
  side,
  offset,
  children,
  intersectionRefs,
  distanceFromViewport,
  transitionDuration,
  className,
  style,
}: PopoverBodyProps) => {
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
      className={combineStringsWithSpaces(
        dynatic`
          position: fixed;
          display: block;
          width: fit-content;
          height: fit-content;
          opacity: 0;
          clip-path: unset;
          left: -9999px;
          top: -9999px;
          transition: opacity ${duration}s ease, visibility ${duration}s ease;
          padding: 5px 10px;
          border-radius: 4px;
          word-wrap: break-word;
        `,
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
};
