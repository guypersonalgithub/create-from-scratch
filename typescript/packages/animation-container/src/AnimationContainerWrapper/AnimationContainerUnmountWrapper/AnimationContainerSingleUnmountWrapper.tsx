import { ReactElement, useLayoutEffect, useState } from "react";
import { UnmountContext } from "./unmountContext";
import { getChildKeys, isAnimationWrapperChild } from "../utils";
import { ChangeMethod } from "../types";

type AnimationContainerSingleUnmountWrapperProps = {
  changeMethod: ChangeMethod;
  children: ReactElement;
};

export const AnimationContainerSingleUnmountWrapper = ({
  changeMethod,
  children,
}: AnimationContainerSingleUnmountWrapperProps) => {
  if (changeMethod === "fullPhase") {
    return <FullPhase>{children}</FullPhase>;
  }

  return <Gradual>{children}</Gradual>;
};

const FullPhase = ({ children }: Pick<AnimationContainerSingleUnmountWrapperProps, "children">) => {
  const [currentChild, setCurrentChild] = useState<ReactElement>(children);
  const [isUnmounted, setIsUnmounted] = useState<boolean>(false);

  useLayoutEffect(() => {
    const isCurrentAnimation = isAnimationWrapperChild({ child: currentChild });

    if (!isCurrentAnimation || currentChild.key === children.key) {
      setCurrentChild(children);
    } else {
      setIsUnmounted(true);
    }
  }, [currentChild, children]);

  return (
    <UnmountContext.Provider
      value={{
        isUnmounted,
        finishedAnimation: () => {
          if (!isUnmounted) {
            return;
          }

          setCurrentChild(children);
          setIsUnmounted(false);
        },
      }}
    >
      {currentChild}
    </UnmountContext.Provider>
  );
};

const Gradual = ({ children }: Pick<AnimationContainerSingleUnmountWrapperProps, "children">) => {
  const [currentChildren, setCurrentChildren] = useState<ReactElement[]>([children]);
  const [childrenKeys, setChildrenKeys] = useState(getChildKeys({ children: [children] }));

  useLayoutEffect(() => {
    const currentChildrenKeys = new Set<string>([children.key ?? ""]);
    const removedChildren: { element: ReactElement; index: number }[] = [];

    currentChildren.forEach((child, index) => {
      const stillExists = currentChildrenKeys.has(child.key ?? "");
      if (!stillExists && isAnimationWrapperChild({ child })) {
        removedChildren.push({ element: child, index });
      }
    });

    const updatedChildren = [children];

    removedChildren.forEach((child) => {
      const { element, index } = child;
      updatedChildren.splice(index, 0, element);
    });

    setCurrentChildren(updatedChildren);
    setChildrenKeys(getChildKeys({ children: [children] }));
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
