import { CSSProperties, useRef } from "react";
import {
  convertKeyframeToCSSProperties,
  detectStoppedFrame,
} from "./AnimationContainerWrapper/utils";

type AnimateArgs = {
  element: Element;
  animation: Keyframe[];
  animationOptions?: KeyframeAnimationOptions;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  fallbackDuration?: number;
};

type GetLastFrameArgs = {
  element: Element;
  animation: Keyframe[];
  animationOptions: KeyframeAnimationOptions;
  fallbackDuration?: number;
};

export const useAnimation = () => {
  const animationRef = useRef<Animation>(null);
  const lastFrameProperties = useRef<CSSProperties>({});

  const getLastFrame = ({
    element,
    animation,
    animationOptions,
    fallbackDuration = 300,
  }: GetLastFrameArgs) => {
    if (!animationRef.current) {
      return;
    }

    const duration = Number(animationOptions.duration ?? fallbackDuration);

    const lastFrame = detectStoppedFrame({
      animation: animationRef.current,
      duration,
      keyframesAmount: animation.length,
    });

    const currentLastFrame = animation[lastFrame];
    const styles = convertKeyframeToCSSProperties({
      element,
      keyframe: currentLastFrame,
    });
    lastFrameProperties.current = styles;
  };

  const animate = ({
    element,
    animation,
    animationOptions = {},
    onAnimationStart,
    onAnimationEnd,
    fallbackDuration = 300,
  }: AnimateArgs) => {
    if (!element) {
      return {};
    }

    onAnimationStart?.();

    const currentAnimation = element.animate(animation, {
      duration: fallbackDuration,
      fill: "forwards",
      ...animationOptions,
    });

    animationRef.current = currentAnimation;

    currentAnimation.onfinish = () => {
      onAnimationEnd?.();
    };

    const stopAnimation = () => {
      if (!animationRef.current) {
        return;
      }

      animationRef.current.cancel();
      getLastFrame({ element, animation, animationOptions, fallbackDuration });
    };

    const cancelAnimation = () => {
      if (!animationRef.current) {
        return;
      }

      animationRef.current.cancel();
    };

    return { cancelAnimation, stopAnimation };
  };

  return {
    animate,
  };
};
