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
