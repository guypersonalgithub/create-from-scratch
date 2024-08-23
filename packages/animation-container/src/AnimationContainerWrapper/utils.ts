import { ReactElement } from "react";

type DoesKeyAlreadyExistInSetArgs = {
  isValid: boolean;
  currentChildKeys: Set<string | null>;
  key: string | null;
};

export const doesKeyAlreadyExistInSet = ({
  isValid,
  currentChildKeys,
  key,
}: DoesKeyAlreadyExistInSetArgs) => {
  if (!isValid) {
    return false;
  }

  return currentChildKeys.has(key);
};

type CheckIfAllPreviousExistInCurrentArgs = {
  array1: string[];
  array2: string[];
};

export const checkIfAllPreviousExistInCurrent = ({
  array1,
  array2,
}: CheckIfAllPreviousExistInCurrentArgs) => {
  const array2Set = new Set(...[array2]);

  for (let i = 0; i < array1.length; i++) {
    const current = array1[i];
    if (!array2Set.has(current)) {
      return { exist: false, length: false };
    }
  }

  return { exist: true, length: array1.length !== array2.length };
};

type CheckIfAtleastOneEExistInCurrentArgs = {
  array1: string[];
  array2: string[];
};

export const checkIfAtleastOneExistsInCurrent = ({
  array1,
  array2,
}: CheckIfAtleastOneEExistInCurrentArgs) => {
  const array2Set = new Set(...[array2]);

  for (let i = 0; i < array1.length; i++) {
    const current = array1[i];
    if (array2Set.has(current)) {
      return true;
    }
  }

  return false;
};

type ShouldAnimationCatchUpArgs = {
  updatedKeys: string[];
  previousKeys: string[];
  animationStarted: string[];
};

export const shouldAnimationCatchUp = ({
  updatedKeys,
  previousKeys,
  animationStarted,
}: ShouldAnimationCatchUpArgs) => {
  const shouldNotCatchUpOne = checkIfAtleastOneExistsInCurrent({
    array1: updatedKeys,
    array2: animationStarted,
  });
  const shouldNotCatchUpTwo = checkIfAtleastOneExistsInCurrent({
    array1: previousKeys,
    array2: animationStarted,
  });

  const shouldCatchUpAndSkipAnimation = !shouldNotCatchUpOne && !shouldNotCatchUpTwo;
  return shouldCatchUpAndSkipAnimation;
};

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
