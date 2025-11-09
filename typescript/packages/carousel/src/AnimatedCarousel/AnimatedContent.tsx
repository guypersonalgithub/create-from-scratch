import { type Dispatch, type RefObject, type SetStateAction } from "react";
import { type AnimatedCarouselProps } from "./types";
import { CarouselContent } from "../CarouselContent";
import { AnimationContainerWrapper } from "@packages/animation-container";
import { dynatic } from "@packages/dynatic-css";

type AnimatedContentProps = Omit<
  AnimatedCarouselProps,
  "automaticTransition" | "stopTransitionWhenOutOfView"
> & {
  contentRef?: RefObject<HTMLDivElement | null>;
  stage: number;
  setStage: Dispatch<SetStateAction<number>>;
  followupTransitions: number[];
  setFollowupTransitions: Dispatch<SetStateAction<number[]>>;
  timeout?: RefObject<NodeJS.Timeout | null>;
  disableLifecycleAnimation?: boolean;
  disabled: boolean;
  currentDirection: "left" | "right";
  setCurrentDirection: Dispatch<SetStateAction<"left" | "right">>;
  isDirectionRight: boolean;
  lastItemIndex: number;
};

export const AnimatedContent = ({
  contentRef,
  className,
  style,
  items,
  displayArrows,
  displayIndicators,
  direction = "right",
  stage,
  setStage,
  followupTransitions,
  setFollowupTransitions,
  transitionDelay,
  timeout,
  disableLifecycleAnimation,
  disabled,
  currentDirection,
  setCurrentDirection,
  isDirectionRight,
  lastItemIndex,
}: AnimatedContentProps) => {
  const transformToTheRight = `translateX(${isDirectionRight ? "-100%" : "100%"})`;
  const currentStage = followupTransitions[followupTransitions.length - 1] ?? stage;

  return (
    <CarouselContent
      contentRef={contentRef}
      className={className}
      style={style}
      items={items}
      stage={stage}
      onLeftArrowClick={(callback) => {
        if (disabled) {
          return;
        }

        if (timeout?.current) {
          clearTimeout(timeout.current);
        }

        setCurrentDirection("left");
        setStage(callback);
      }}
      onRightArrowClick={(callback) => {
        if (disabled) {
          return;
        }

        if (timeout?.current) {
          clearTimeout(timeout.current);
        }

        setCurrentDirection("right");
        setStage(callback);
      }}
      onIndicatorClick={(value) => {
        if (disabled) {
          return;
        }

        if (timeout?.current) {
          clearTimeout(timeout.current);
        }

        const stageDifference = value - stage;
        const isRight = stageDifference > 0;
        setCurrentDirection(isRight ? "right" : "left");
        const amountOfStages = Math.abs(stageDifference);

        if (amountOfStages === 1) {
          setStage(value);

          return;
        }

        const followupTransitions: number[] = [];

        if (isRight) {
          for (let i = amountOfStages; i > 0; i--) {
            const currentStage = stage + i;
            followupTransitions.push(currentStage);
          }
        } else {
          for (let i = amountOfStages; i > 0; i--) {
            const currentStage = stage - i;
            followupTransitions.push(currentStage);
          }
        }

        setFollowupTransitions(followupTransitions);
      }}
      displayArrows={displayArrows}
      displayIndicators={displayIndicators}
    >
      <div
        className={dynatic`
          overflow: hidden;
          height: inherit;
          position: relative;
          width: inherit;
        `}
      >
        <AnimationContainerWrapper
          changeMethod="gradual"
          className={dynatic`
            width: inherit;
            height: inherit;
            position: absolute;  
          `}
          classNameOnceAnimating={dynatic`
            transform: ${transformToTheRight};
          `}
          onMount={[{ transform: transformToTheRight }, { transform: "translateX(0%)" }]}
          onUnmount={[
            { transform: "translateX(0%)" },
            { transform: `translateX(${isDirectionRight ? "100%" : "-100%"})` },
          ]}
          onMountAnimationEnd={() => {
            if (followupTransitions.length > 0) {
              const currentFollowup = followupTransitions[followupTransitions.length - 1];
              let hasRemainingFollowups = false;
              setFollowupTransitions((prev) => {
                const copy = prev.slice();
                copy.pop();
                hasRemainingFollowups = copy.length > 0;

                return copy;
              });
              setStage(currentFollowup!);

              if (hasRemainingFollowups) {
                return;
              }
            }

            if (disableLifecycleAnimation || !timeout) {
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
          }}
        >
          <div key={`stage-${currentStage}`}>{items[currentStage] ?? null}</div>
        </AnimationContainerWrapper>
      </div>
    </CarouselContent>
  );
};
