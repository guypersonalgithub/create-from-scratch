import { isValidElement, ReactNode, useEffect, useRef, useState, MutableRefObject } from "react";
import { AnimationContainerWrapperProps } from "./types";
import { AnimationWrapper } from "./AnimationContainer";
import {
  checkIfAllPreviousExistInCurrent,
  doesKeyAlreadyExistInSet,
  shouldAnimationCatchUp,
} from "./utils";
import { areArraysEqual } from "@packages/utils";

type GetChildKeysArgs = {
  children: ReactNode[];
};

const getChildKeys = ({ children }: GetChildKeysArgs) => {
  const keysSet = new Set<string>();
  children.forEach((child) => {
    if (isValidElement(child) && child.key) {
      keysSet.add(child.key);
    }
  });
  return keysSet;
};

export const MultiChildrenContainerWrapper = ({
  children,
  from,
  to,
  options,
  animationRef,
  previousAnimationRefs,
}: AnimationContainerWrapperProps & {
  children: ReactNode[];
  animationRef: MutableRefObject<Animation | undefined>;
  previousAnimationRefs: MutableRefObject<Animation[]>;
}) => {
  const [currentChildren, setCurrentChildren] = useState<ReactNode[]>(children);
  const [childKeys, setChildKeys] = useState<Set<string>>(getChildKeys({ children }));
  const currentChildKeys = useRef<Set<string>>(getChildKeys({ children }));
  const animationStarted = useRef<Set<string>>(getChildKeys({ children }));

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

    if ((exist && length) || shouldCatchUpAndSkipAnimation) {
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
        key={isValid ? child.key : index}
        show={keyAlreadyExists}
        from={from}
        to={to}
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

          if (
            currentChildKeys.current.size === 0 ||
            areArraysEqual({ array1: [...currentChildKeys.current], array2: [...newChildrenKeys] })
          ) {
            setCurrentChildren(children);
            animationStarted.current = new Set();
          }
        }}
        animationRef={animationRef}
        previousAnimationRefs={previousAnimationRefs}
      >
        <div style={{ height: "inherit", width: "inherit" }}>{child}</div>
      </AnimationWrapper>
    );
  });
};
