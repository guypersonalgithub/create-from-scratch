import { useState, useRef, useEffect, type ReactElement, type CSSProperties } from "react";
import { type AnimationContainerWrapperProps } from "./types";
import { continueReversedStoppedAnimation, detectStoppedFrame, reverseKeyframes } from "./utils";

type AnimationWrapperProps = Omit<AnimationContainerWrapperProps, "children" | "changeMethod"> & {
  index: number;
  show: boolean;
  children: ReactElement;
};

const fallbackDuration = 300;

export const AnimationWrapper = ({
  index,
  show,
  children,
  onMount = [],
  onUnmount,
  mountOptions = {},
  unmountOptions = mountOptions,
  onMountAnimationStart,
  onMountAnimationEnd,
  onUnmountAnimationStart,
  onUnmountAnimationEnd,
  clearLifeCycleAnimationOnExitRef,
  style = {},
  styleOnceAnimating = {},
  disableLifeCycleAnimations,
  externalRef,
  disabledMountAnimationOnInit,
}: AnimationWrapperProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [removeState, setRemove] = useState(!show);
  const lifeCycleAnimationRef = useRef<Animation>(null);
  const previousLifeCycleAnimationRefs = useRef<Animation[]>([]);
  const initialized = useRef(false);
  const stoppedFrame = useRef<number>(0);
  const lastFrameProperties = useRef<CSSProperties>({});

  clearLifeCycleAnimationOnExitRef.current[index] = () => {
    lifeCycleAnimationRef.current?.cancel();
    previousLifeCycleAnimationRefs.current.forEach((lifeCycleAnimationRef) => {
      lifeCycleAnimationRef.cancel();
    });
  };

  useEffect(() => {
    const noOnmountFrames = onMount.length === 0;

    if (
      disableLifeCycleAnimations ||
      (show && noOnmountFrames) ||
      (!show && noOnmountFrames && (!onUnmount || onUnmount.length === 0)) ||
      disabledMountAnimationOnInit
    ) {
      return;
    }

    const childElement = elementRef.current;
    const shouldReverseOnUnmount = !onUnmount;

    const setAnimationRef = ({ animation }: { animation: Animation }) => {
      lifeCycleAnimationRef.current = animation;
      previousLifeCycleAnimationRefs.current.forEach((animation) => {
        animation.cancel();
      });
      previousLifeCycleAnimationRefs.current = [];
    };

    if (show) {
      setRemove(false);
      if (!childElement) {
        return;
      }

      const currentFrames = shouldReverseOnUnmount
        ? continueReversedStoppedAnimation({
            keyframes: onMount,
            initialized: initialized.current,
            childElement,
            stoppedFrame: stoppedFrame.current,
          })
        : onMount;

      onMountAnimationStart?.();

      const animation = childElement.animate(currentFrames, {
        duration: fallbackDuration,
        ...mountOptions,
        fill: "forwards",
      });

      setAnimationRef({ animation });
      animation.onfinish = () => {
        onMountAnimationEnd?.();
      };
      initialized.current = true;
    } else {
      if (!childElement) {
        return;
      }

      const currentFrames = shouldReverseOnUnmount
        ? continueReversedStoppedAnimation({
            keyframes: reverseKeyframes({ keyframes: onMount }),
            initialized: initialized.current,
            childElement,
            stoppedFrame: stoppedFrame.current,
          })
        : onUnmount;

      onUnmountAnimationStart?.();

      const animation = childElement.animate(currentFrames, {
        duration: fallbackDuration,
        ...unmountOptions,
        fill: "forwards",
      });

      setAnimationRef({ animation });
      animation.onfinish = () => {
        initialized.current = false;
        setRemove(true);
        onUnmountAnimationEnd?.();
      };
    }

    return () => {
      lifeCycleAnimationRef.current?.pause();
      if (lifeCycleAnimationRef.current) {
        previousLifeCycleAnimationRefs.current.push(lifeCycleAnimationRef.current);
      }

      if (lifeCycleAnimationRef.current && shouldReverseOnUnmount) {
        const currentFrames = show
          ? onMount
          : onUnmount || reverseKeyframes({ keyframes: onMount });
        const duration = Number(mountOptions.duration ?? fallbackDuration);
        const currentFramesAmount = currentFrames.length;

        const lastFrame = detectStoppedFrame({
          animation: lifeCycleAnimationRef.current,
          duration,
          keyframesAmount: currentFramesAmount,
        });

        stoppedFrame.current = lastFrame === onMount.length - 1 ? 0 : lastFrame;
      }
    };
  }, [show, removeState]);

  if (removeState) {
    return null;
  }

  return (
    <div
      ref={(ref) => {
        elementRef.current = ref;
        if (externalRef) {
          externalRef.current = ref;
        }
      }}
      style={{
        ...style,
        ...(!disabledMountAnimationOnInit ? styleOnceAnimating : {}),
        ...lastFrameProperties.current,
      }}
    >
      {children}
    </div>
  );
};
