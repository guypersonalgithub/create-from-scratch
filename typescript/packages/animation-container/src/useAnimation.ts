import { areArraysEqual } from "@packages/array-utils";
import { CSSProperties, RefObject, useEffect, useRef } from "react";
import {
  convertKeyframeToCSSProperties,
  detectStoppedFrame,
} from "./AnimationContainerWrapper/utils";

type UseAnimationArgs = {
  animation?: Keyframe[];
  removeState: boolean;
  elementRef: RefObject<HTMLDivElement | null>;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  fallbackDuration: number;
  animationOptions: KeyframeAnimationOptions;
  animationRef: RefObject<Animation | null>;
  disableAnimation?: boolean;
  lastFrameProperties: RefObject<CSSProperties>;
};

export const useAnimation = ({
  animation,
  removeState,
  elementRef,
  onAnimationStart,
  onAnimationEnd,
  fallbackDuration,
  animationOptions,
  animationRef,
  disableAnimation,
  lastFrameProperties,
}: UseAnimationArgs) => {
  const previousKeyframes = useRef<Keyframe[]>([]);

  useEffect(() => {
    if (
      removeState ||
      !animation ||
      disableAnimation ||
      areArraysEqual({
        array1: animation,
        array2: previousKeyframes.current,
      })
    ) {
      return;
    }

    const childElement = elementRef.current;
    if (!childElement) {
      return;
    }

    onAnimationStart?.();

    const currentAnimation = childElement.animate(animation, {
      duration: fallbackDuration,
      fill: "forwards",
      ...animationOptions,
    });

    animationRef.current = currentAnimation;
    currentAnimation.onfinish = () => {
      onAnimationEnd?.();
      if (animationRef.current) {
        const duration = Number(animationOptions.duration ?? fallbackDuration);

        const lastFrame = detectStoppedFrame({
          animation: animationRef.current,
          duration,
          keyframesAmount: animation.length,
        });

        const currentLastFrame = animation[lastFrame];
        const styles = convertKeyframeToCSSProperties({
          element: childElement,
          keyframe: currentLastFrame,
        });
        lastFrameProperties.current = styles;
      }
    };

    return () => {
      animationRef.current?.cancel();
      previousKeyframes.current = animation.slice();
    };
  }, [removeState, animation, disableAnimation]);
};
