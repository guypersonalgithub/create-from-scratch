import { observeElementVisibility } from "@packages/utils";
import { useState, useRef, useEffect } from "react";
import { AnimationlessCarouselProps } from "./types";
import { AnimationlessContent } from "./AnimationlessContent";

export const AnimationlessCarousel = ({
  style,
  items,
  automaticTransition,
  stopTransitionWhenOutOfView,
  transitionDelay,
  displayArrows = true,
  displayIndicators = true,
}: AnimationlessCarouselProps) => {
  if (automaticTransition) {
    return (
      <AutomaticAnimationlessCarousel
        style={style}
        items={items}
        stopTransitionWhenOutOfView={stopTransitionWhenOutOfView}
        transitionDelay={transitionDelay}
        displayArrows={displayArrows}
        displayIndicators={displayIndicators}
      />
    );
  }

  return (
    <ManualAnimationlessCarousel
      style={style}
      items={items}
      displayArrows={displayArrows}
      displayIndicators={displayIndicators}
    />
  );
};

type AutomaticAnimationlessCarouselProps = Omit<AnimationlessCarouselProps, "automaticTransition">;

const AutomaticAnimationlessCarousel = ({
  style,
  items,
  stopTransitionWhenOutOfView = false,
  transitionDelay = 1000,
  displayArrows,
  displayIndicators,
}: AutomaticAnimationlessCarouselProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);
  const interval = useRef<NodeJS.Timeout>(null);
  const [disableTransition, setDisableTransition] = useState(stopTransitionWhenOutOfView);
  const lastItemIndex = items.length - 1;

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const transitionCallback = () => {
      interval.current = setInterval(() => {
        setStage((prev) => {
          if (prev === lastItemIndex) {
            return 0;
          }

          return prev + 1;
        });
      }, transitionDelay);
    };

    if (!stopTransitionWhenOutOfView) {
      transitionCallback();
      return;
    }

    const observer = observeElementVisibility({
      element: ref.current,
      observerCallback: ({ isIntersection }) => {
        setDisableTransition(!isIntersection);

        if (!isIntersection) {
          if (interval.current) {
            clearInterval(interval.current);
          }
        } else {
          if (!disableTransition) {
            return;
          }

          transitionCallback();
        }
      },
    });

    return () => {
      observer.disconnect();
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, [disableTransition, transitionDelay, lastItemIndex, stopTransitionWhenOutOfView]);

  return (
    <AnimationlessContent
      contentRef={ref}
      style={style}
      items={items}
      displayArrows={displayArrows}
      displayIndicators={displayIndicators}
      stage={stage}
      setStage={setStage}
    />
  );
};

type ManualAnimationlessCarouselProps = Omit<
  AnimationlessCarouselProps,
  "automaticTransition" | "stopTransitionWhenOutOfView" | "transitionDelay"
>;

const ManualAnimationlessCarousel = ({
  style,
  items,
  displayArrows,
  displayIndicators,
}: ManualAnimationlessCarouselProps) => {
  const [stage, setStage] = useState(0);

  return (
    <AnimationlessContent
      style={style}
      items={items}
      displayArrows={displayArrows}
      displayIndicators={displayIndicators}
      stage={stage}
      setStage={setStage}
    />
  );
};
