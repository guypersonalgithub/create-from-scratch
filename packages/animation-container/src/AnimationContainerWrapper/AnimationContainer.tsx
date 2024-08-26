import { useState, useRef, useEffect, ReactElement } from "react";
import { AnimationContainerWrapperProps } from "./types";
import { continueReversedStoppedAnimation, detectStoppedFrame, reverseKeyframes } from "./utils";
import { useAnimation } from "../useAnimation";

type AnimationWrapperProps = Omit<AnimationContainerWrapperProps, "children"> & {
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
  animation,
  animationOptions = {},
  onMountAnimationStart,
  onMountAnimationEnd,
  onUnmountAnimationStart,
  onUnmountAnimationEnd,
  onAnimationStart,
  onAnimationEnd,
  clearLifeCycleAnimationOnExitRef,
  clearAnimationOnExitRef,
  style,
  disableLifeCycleAnimations,
  disableAnimation,
}: AnimationWrapperProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [removeState, setRemove] = useState(!show);
  const lifeCycleAnimationRef = useRef<Animation>();
  const previousLifeCycleAnimationRefs = useRef<Animation[]>([]);
  const animationRef = useRef<Animation>();
  const initialized = useRef(false);
  const stoppedFrame = useRef<number>(0);
  useAnimation({
    animation,
    removeState,
    elementRef,
    onAnimationStart,
    onAnimationEnd,
    fallbackDuration,
    animationOptions,
    animationRef,
    disableAnimation,
  });

  clearLifeCycleAnimationOnExitRef.current[index] = () => {
    lifeCycleAnimationRef.current?.cancel();
    previousLifeCycleAnimationRefs.current.forEach((lifeCycleAnimationRef) => {
      lifeCycleAnimationRef.cancel();
    });
  };

  clearAnimationOnExitRef.current[index] = () => {
    animationRef.current?.cancel();
  };

  useEffect(() => {
    if (disableLifeCycleAnimations) {
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
    <div ref={elementRef} style={style}>
      {children}
    </div>
  );
};
