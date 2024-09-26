import { MutableRefObject, RefObject, useEffect } from "react";

type UseAnimationArgs = {
  animation?: Keyframe[];
  removeState: boolean;
  elementRef: RefObject<HTMLDivElement>;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  fallbackDuration: number;
  animationOptions: KeyframeAnimationOptions;
  animationRef: MutableRefObject<Animation | undefined>;
  disableAnimation?: boolean;
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
}: UseAnimationArgs) => {
  useEffect(() => {
    if (removeState || !animation || disableAnimation) {
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
    };

    return () => {
      animationRef.current?.cancel();
    };
  }, [removeState, animation, disableAnimation]);
};
