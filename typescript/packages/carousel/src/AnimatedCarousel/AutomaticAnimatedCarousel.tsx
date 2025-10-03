import { useRef, useState, useEffect } from "react";
import { type AnimatedCarouselProps } from "./types";
import { observeElementVisibility } from "@packages/element-utils";
import { AnimatedContent } from "./AnimatedContent";

type AutomaticAnimatedCarouselProps = Omit<AnimatedCarouselProps, "automaticTransition">;

export const AutomaticAnimatedCarousel = ({
  style,
  items,
  stopTransitionWhenOutOfView,
  transitionDelay = 3000,
  displayArrows = true,
  displayIndicators = true,
  direction = "right",
}: AutomaticAnimatedCarouselProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);
  const timeout = useRef<NodeJS.Timeout>(null);
  const [currentDirection, setCurrentDirection] = useState(direction);
  const [followupTransitions, setFollowupTransitions] = useState<number[]>([]);
  const [disableTransition, setDisableTransition] = useState(stopTransitionWhenOutOfView);
  const disabled = followupTransitions.length > 0;
  const lastItemIndex = items.length - 1;
  const isDirectionRight = currentDirection === "right";

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(() => {
      if (currentDirection !== direction) {
        setCurrentDirection(direction);
      }

      setStage((prev) => {
        if (isDirectionRight) {
          if (prev === lastItemIndex) {
            return 0;
          }

          return prev + 1;
        }

        if (prev === lastItemIndex) {
          return 0;
        }

        return prev + 1;
      });
    }, transitionDelay);
  }, []);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    if (!stopTransitionWhenOutOfView) {
      return;
    }

    if (disabled) {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }

      return;
    }

    const observer = observeElementVisibility({
      element: ref.current,
      observerCallback: ({ isIntersection }) => {
        setDisableTransition(!isIntersection);

        if (!isIntersection) {
          if (timeout.current) {
            clearTimeout(timeout.current);
          }
        } else {
          if (!disableTransition) {
            return;
          }

          timeout.current = setTimeout(() => {
            if (currentDirection !== direction) {
              setCurrentDirection(direction);
            }

            setStage((prev) => {
              if (isDirectionRight) {
                if (prev === lastItemIndex) {
                  return 0;
                }

                return prev + 1;
              }

              if (prev === lastItemIndex) {
                return 0;
              }

              return prev + 1;
            });
          }, transitionDelay);
        }
      },
    });

    return () => {
      observer.disconnect();
    };
  }, [
    disableTransition,
    transitionDelay,
    lastItemIndex,
    lastItemIndex,
    isDirectionRight,
    stopTransitionWhenOutOfView,
  ]);

  return (
    <AnimatedContent
      contentRef={ref}
      timeout={timeout}
      style={style}
      items={items}
      displayArrows={displayArrows}
      displayIndicators={displayIndicators}
      stage={stage}
      setStage={setStage}
      followupTransitions={followupTransitions}
      setFollowupTransitions={setFollowupTransitions}
      direction={direction}
      disabled={disabled}
      currentDirection={currentDirection}
      setCurrentDirection={setCurrentDirection}
      isDirectionRight={isDirectionRight}
      lastItemIndex={lastItemIndex}
      transitionDelay={transitionDelay}
    />
  );
};
