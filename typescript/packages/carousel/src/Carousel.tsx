import { useRef, useState, Fragment, CSSProperties, useEffect } from "react";
import { AnimationContainerWrapper } from "@packages/animation-container";
import { observeElementVisibility } from "@packages/utils";

type CarouselProps = {
  style?: CSSProperties;
  items: [];
  transitionDelay?: number;
};

export const Carousel = ({ style, items, transitionDelay = 3000 }: CarouselProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);
  const timeout = useRef<NodeJS.Timeout>(null);
  const [disableLifecycleAnimation, setDisableLifecycleAnimation] = useState(false);
  const lastItemIndex = items.length - 1;

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const observer = observeElementVisibility({
      element: ref.current,
      observerCallback: ({ isIntersection }) => {
        setDisableLifecycleAnimation(!isIntersection);

        if (!isIntersection) {
          if (timeout.current) {
            clearTimeout(timeout.current);
          }
        } else {
          if (!disableLifecycleAnimation) {
            return;
          }

          timeout.current = setTimeout(() => {
            setStage((prev) => {
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
  }, [disableLifecycleAnimation, transitionDelay, lastItemIndex]);

  return (
    <div ref={ref} style={style}>
      <AnimationContainerWrapper
        changeMethod="fullPhase"
        style={{ width: "100%", transform: "translateX(-100%)" }}
        onMount={[
          { opacity: 0, transform: "translateX(-100%)" },
          { opacity: 1, transform: "translateX(0%)" },
        ]}
        onUnmount={[
          { opacity: 1, transform: "translateX(0%)" },
          { opacity: 0, transform: "translateX(100%)" },
        ]}
        onMountAnimationEnd={() => {
          if (disableLifecycleAnimation) {
            return;
          }

          timeout.current = setTimeout(() => {
            setStage((prev) => {
              if (prev === lastItemIndex) {
                return 0;
              }

              return prev + 1;
            });
          }, transitionDelay);
        }}
      >
        <Fragment key={stage}>{items[stage] ?? null}</Fragment>
      </AnimationContainerWrapper>
    </div>
  );
};
