import { isValidElement, ReactElement, useEffect, useRef, useState } from "react";
import { AnimationContainerWrapperProps } from "./types";
import { AnimationWrapper } from "./AnimationContainer";
import {
  checkIfAllPreviousExistInCurrent,
  doesKeyAlreadyExistInSet,
  getChildKeys,
  shouldAnimationCatchUp,
} from "./utils";
import { areArraysEqual } from "@packages/utils";

export const MultiChildrenContainerWrapper = ({
  children,
  onMount,
  onUnmount,
  options,
  clearAnimationOnExit,
  style,
  isUnmounted,
  finishedAnimation,
}: AnimationContainerWrapperProps & {
  children: ReactElement[];
  isUnmounted: boolean;
  finishedAnimation?: () => void;
}) => {
  const [currentChildren, setCurrentChildren] = useState<ReactElement[]>(children);
  const [childKeys, setChildKeys] = useState<Set<string>>(getChildKeys({ children }));
  const currentChildKeys = useRef<Set<string>>(getChildKeys({ children }));
  const animationStarted = useRef<Set<string>>(getChildKeys({ children }));
  const animationActive = useRef(false);

  useEffect(() => {
    const previousKeys = [...currentChildKeys.current];
    const updatedKeys = getChildKeys({ children });
    currentChildKeys.current = updatedKeys;
    const updatedKeysArray = [...updatedKeys];
    const animationStartedArray = [...animationStarted.current];

    const { exist, length } = checkIfAllPreviousExistInCurrent({
      array1: previousKeys,
      array2: updatedKeysArray,
    });

    const shouldCatchUpAndSkipAnimation = shouldAnimationCatchUp({
      updatedKeys: updatedKeysArray,
      previousKeys,
      animationStarted: animationStartedArray,
    });

    if ((exist && length) || (shouldCatchUpAndSkipAnimation && animationActive.current)) {
      setCurrentChildren(children);
      animationStarted.current = new Set();
    }
    setChildKeys(updatedKeys);
  }, [children]);

  return currentChildren.map((child, index) => {
    const isValid = isValidElement(child);
    const keyAlreadyExists = doesKeyAlreadyExistInSet({
      isValid,
      currentChildKeys: childKeys,
      key: isValid ? child.key : null,
    });

    return (
      <AnimationWrapper
        index={index}
        key={isValid ? child.key : index}
        show={isUnmounted ? false : keyAlreadyExists}
        onMount={onMount}
        onUnmount={onUnmount}
        options={options}
        onAnimationStart={() => {
          if (!isValid || !child.key) {
            return;
          }

          animationStarted.current.add(child.key);
        }}
        onAnimationEnd={() => {
          if (!isValid || !child.key) {
            return;
          }

          currentChildKeys.current.delete(child.key);
          const newChildrenKeys = getChildKeys({ children });
          finishedAnimation?.();

          if (
            currentChildKeys.current.size === 0 ||
            areArraysEqual({ array1: [...currentChildKeys.current], array2: [...newChildrenKeys] })
          ) {
            setCurrentChildren(children);
            animationStarted.current = new Set();
          }
        }}
        clearAnimationOnExit={clearAnimationOnExit}
        animationActive={animationActive}
        style={style}
      >
        <div style={{ height: "inherit", width: "inherit" }}>{child}</div>
      </AnimationWrapper>
    );
  });
};
