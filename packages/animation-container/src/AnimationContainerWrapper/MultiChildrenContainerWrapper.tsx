import { isValidElement, ReactNode, useEffect, useRef, useState } from "react";
import { AnimationContainerWrapperProps } from "./types";
import { AnimationWrapper } from "./AnimationContainer";

// TODO: Move some of these functions to @packages/utils.

type DoesKeyAlreadyExistInSetArgs = {
  isValid: boolean;
  currentChildKeys: Set<string | null>;
  key: string | null;
};

const doesKeyAlreadyExistInSet = ({
  isValid,
  currentChildKeys,
  key,
}: DoesKeyAlreadyExistInSetArgs) => {
  if (!isValid) {
    return false;
  }

  return currentChildKeys.has(key);
};

type AreArraysEqualArgs = {
  array1: string[];
  array2: string[];
};

const areArraysEqual = ({ array1, array2 }: AreArraysEqualArgs) => {
  if (array1.length !== array2.length) {
    return false;
  }

  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }

  return true;
};

type CheckIfAllPreviousExistInCurrentArgs = {
  array1: string[];
  array2: string[];
};

const checkIfAllPreviousExistInCurrent = ({
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
}: AnimationContainerWrapperProps & { children: ReactNode[] }) => {
  const [currentChildren, setCurrentChildren] = useState<ReactNode[]>(children);
  const [childKeys, setChildKeys] = useState<Set<string>>(getChildKeys({ children }));
  const currentChildKeys = useRef<Set<string>>(getChildKeys({ children }));

  useEffect(() => {
    const previousKeys = [...currentChildKeys.current];
    const updatedKeys = getChildKeys({ children });
    currentChildKeys.current = updatedKeys;

    const { exist, length } = checkIfAllPreviousExistInCurrent({
      array1: previousKeys,
      array2: [...updatedKeys],
    });
    if (exist && length) {
      setCurrentChildren(children);
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
          }
        }}
      >
        <div style={{ height: "inherit", width: "inherit" }}>{child}</div>
      </AnimationWrapper>
    );
  });
};
