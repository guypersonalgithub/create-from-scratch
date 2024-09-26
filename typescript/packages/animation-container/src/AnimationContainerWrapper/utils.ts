import { ReactElement } from "react";

type ReverseKeyframesArgs = {
  keyframes: Keyframe[];
};

export const reverseKeyframes = ({ keyframes }: ReverseKeyframesArgs) => {
  return keyframes
    .map((keyframe) => {
      return {
        ...keyframe,
        offset: keyframe.offset ? 1 - keyframe.offset : undefined,
      };
    })
    .reverse();
};

type DetectStoppedFrameArgs = {
  animation: Animation;
  duration: number;
  keyframesAmount: number;
};

export const detectStoppedFrame = ({
  animation,
  duration,
  keyframesAmount,
}: DetectStoppedFrameArgs) => {
  const currentTime = animation.currentTime as number;
  if (!currentTime) {
    return 0;
  }

  const progress = currentTime / duration;
  const approximateKeyframeIndex = Math.floor(progress * (keyframesAmount - 1));
  return approximateKeyframeIndex;
};

type GetElementStylesArgs = {
  element: Element;
  stage: Keyframe;
};

export const getElementStyles = ({ element, stage }: GetElementStylesArgs) => {
  const styles: Keyframe = {};
  const computedStyle = getComputedStyle(element);
  for (let property in stage) {
    styles[property] = computedStyle.getPropertyValue(property);
  }

  return styles;
};

type ContinueReversedStoppedAnimationArgs = {
  keyframes: Keyframe[];
  initialized?: boolean;
  childElement: HTMLDivElement;
  stoppedFrame: number;
};

export const continueReversedStoppedAnimation = ({
  keyframes,
  initialized,
  childElement,
  stoppedFrame,
}: ContinueReversedStoppedAnimationArgs) => {
  if (!initialized) {
    return keyframes;
  }

  if (!keyframes || keyframes.length === 0) {
    return [];
  }

  const styles = getElementStyles({
    element: childElement,
    stage: keyframes[stoppedFrame],
  });

  const previousStoppedFrame = keyframes[stoppedFrame];
  return [{ ...styles, offset: previousStoppedFrame.offset }, ...keyframes.slice(stoppedFrame + 1)];
};

export function isComponentType(type: any): type is React.ComponentType<any> {
  return typeof type === "function";
}

type isAnimationWrapperChildArgs = {
  child: ReactElement;
};

export const isAnimationWrapperChild = ({ child }: isAnimationWrapperChildArgs) => {
  const isAnimation = isComponentType(child.type)
    ? child.type.name === "AnimationContainerWrapper"
    : false;

  return isAnimation;
};

type GetChildKeysArgs = {
  children: ReactElement[];
};

export const getChildKeys = ({ children }: GetChildKeysArgs) => {
  const keysSet = new Set<string>();
  children.forEach((child) => {
    keysSet.add(child.key ?? "");
  });
  return keysSet;
};

type GetAnimationWrapperChildKeysArgs = {
  children: ReactElement[];
};

export const getAnimationWrapperChildKeys = ({ children }: GetAnimationWrapperChildKeysArgs) => {
  const keysSet = new Set<string>();
  children.forEach((child) => {
    if (isAnimationWrapperChild({ child })) {
      keysSet.add(child.key ?? "");
    }
  });
  return keysSet;
};

type animationWrapperChildrenKeysArgs = {
  children: ReactElement[];
};

export const animationWrapperChildrenKeys = ({ children }: animationWrapperChildrenKeysArgs) => {
  const keysSet = new Set<string>();
  children.forEach((child) => {
    if (isAnimationWrapperChild({ child })) {
      keysSet.add(child.key ?? "");
    }
  });
  return keysSet;
};
