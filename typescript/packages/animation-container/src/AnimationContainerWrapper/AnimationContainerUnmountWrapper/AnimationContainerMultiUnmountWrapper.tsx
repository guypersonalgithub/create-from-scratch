import { ReactElement, useEffect, useState, useRef } from "react";
import { getAnimationWrapperChildKeys, getChildKeys, isAnimationWrapperChild } from "../utils";
import { UnmountContext } from "./unmountContext";
import { areSetsEqual } from "@packages/utils";
import { ChangeMethod } from "../types";

type AnimationContainerMultiUnmountWrapperProps = {
  changeMethod: ChangeMethod;
  children: ReactElement[];
};

export const AnimationContainerMultiUnmountWrapper = ({
  changeMethod,
  children,
}: AnimationContainerMultiUnmountWrapperProps) => {
  if (changeMethod === "fullPhase") {
    return <FullPhase>{children}</FullPhase>;
  }

  return <Gradual>{children}</Gradual>;
};

const FullPhase = ({ children }: Pick<AnimationContainerMultiUnmountWrapperProps, "children">) => {
  const [currentChildren, setCurrentChildren] = useState<ReactElement[]>(children);
  const [childrenKeys, setChildrenKeys] = useState(getChildKeys({ children }));
  const currentChildKeys = useRef<Set<string>>(getAnimationWrapperChildKeys({ children }));
  const latestChildrenRef = useRef<ReactElement[]>(children);

  useEffect(() => {
    latestChildrenRef.current = children;
    setChildrenKeys(getChildKeys({ children }));
    const updatedKeys = getAnimationWrapperChildKeys({ children });
    const areAnimationsEqual = areSetsEqual({ setA: currentChildKeys.current, setB: updatedKeys });
    if (currentChildKeys.current.size > 0 && !areAnimationsEqual) {
      return;
    }

    currentChildKeys.current = updatedKeys;
    setCurrentChildren(children);
  }, [children]);

  return currentChildren.map((child) => {
    const isUnmounted = !childrenKeys.has(child.key!);

    return (
      <UnmountContext.Provider
        key={child.key}
        value={{
          isUnmounted,
          finishedAnimation: () => {
            if (!isUnmounted) {
              return;
            }

            currentChildKeys.current.delete(child.key!);
            if (currentChildKeys.current.size > 0) {
              return;
            }

            const updatedKeys = getAnimationWrapperChildKeys({
              children: latestChildrenRef.current,
            });
            currentChildKeys.current = updatedKeys;
            setCurrentChildren(latestChildrenRef.current);
          },
        }}
      >
        {child}
      </UnmountContext.Provider>
    );
  });
};

const Gradual = ({ children }: Pick<AnimationContainerMultiUnmountWrapperProps, "children">) => {
  const [currentChildren, setCurrentChildren] = useState<ReactElement[]>(children);
  const [childrenKeys, setChildrenKeys] = useState(getChildKeys({ children }));

  useEffect(() => {
    const currentChildrenKeys = new Set<string>(children.map((child) => child.key ?? ""));
    const removedChildren: { element: ReactElement; index: number }[] = [];

    currentChildren.forEach((child, index) => {
      const stillExists = currentChildrenKeys.has(child.key ?? "");
      if (!stillExists && isAnimationWrapperChild({ child })) {
        removedChildren.push({ element: child, index });
      }
    });

    const updatedChildren = [...children];

    removedChildren.forEach((child) => {
      const { element, index } = child;
      updatedChildren.splice(index, 0, element);
    });

    setCurrentChildren(updatedChildren);
    setChildrenKeys(getChildKeys({ children }));
  }, [children]);

  const removeCurrentChild = ({ child }: { child: ReactElement }) => {
    const key = child.key;
    setCurrentChildren((prev) => {
      return prev.filter((curr) => {
        const currKey = curr.key;

        return currKey !== key;
      });
    });
  };

  return currentChildren.map((child) => {
    const isUnmounted = !childrenKeys.has(child.key!);

    return (
      <UnmountContext.Provider
        key={child.key}
        value={{
          isUnmounted,
          finishedAnimation: () => {
            if (!isUnmounted) {
              return;
            }

            removeCurrentChild({ child });
          },
        }}
      >
        {child}
      </UnmountContext.Provider>
    );
  });
};
