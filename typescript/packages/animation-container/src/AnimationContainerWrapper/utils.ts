import { ReactElement } from "react";
import { CSSPropertiesWithIndex } from "./types";
import { convertStringFormat } from "@packages/utils";
import { IS_ANIMATION_CONTAINER_WRAPPER } from "./AnimationContainerWrapper";

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

type ConvertKeyframeToCSSPropertiesArgs = {
  element: Element;
  keyframe: Keyframe;
};

export const convertKeyframeToCSSProperties = ({
  element,
  keyframe,
}: ConvertKeyframeToCSSPropertiesArgs) => {
  const computedStyle = getComputedStyle(element);
  const style: CSSPropertiesWithIndex = {};
  const relevantProperties = new Set<string>();
  Object.keys(keyframe).forEach((property) => relevantProperties.add(property));

  relevantProperties.forEach((property) => {
    const cssValue = computedStyle.getPropertyValue(property);
    if (cssValue) {
      const reactKey = convertStringFormat({
        str: property,
        formatFrom: "kebab",
        formatTo: "camel",
      });
      style[reactKey] = cssValue;
    }
  });

  return style;
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

function isAnimationContainerWrapperComponent(
  component: unknown,
): component is { [IS_ANIMATION_CONTAINER_WRAPPER]: true } {
  return typeof component === "function" && IS_ANIMATION_CONTAINER_WRAPPER in component;
}

type isAnimationWrapperChildArgs = {
  child: ReactElement;
};

export const isAnimationWrapperChild = ({ child }: isAnimationWrapperChildArgs) => {
  const isAnimation = isComponentType(child.type)
    ? child.type && isAnimationContainerWrapperComponent(child.type)
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
