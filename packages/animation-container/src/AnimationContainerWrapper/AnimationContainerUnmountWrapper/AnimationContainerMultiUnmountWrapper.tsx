import { ReactElement, useEffect, useState } from "react";
import { getChildKeys, isAnimationWrapperChild } from "../utils";
import { UnmountContext } from "./unmountContext";

type AnimationContainerMultiUnmountWrapperProps = {
  children: ReactElement[];
};

export const AnimationContainerMultiUnmountWrapper = ({
  children,
}: AnimationContainerMultiUnmountWrapperProps) => {
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

  const removeCurrentChild = (child: ReactElement) => {
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

            removeCurrentChild(child);
          },
        }}
      >
        {child}
      </UnmountContext.Provider>
    );
  });
};
