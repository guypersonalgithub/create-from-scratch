import { ReactElement, useEffect, useState } from "react";
import { UnmountContext } from "./unmountContext";
import { isAnimationWrapperChild } from "../utils";

type AnimationContainerSingleUnmountWrapperProps = {
  children: ReactElement;
};

export const AnimationContainerSingleUnmountWrapper = ({
  children,
}: AnimationContainerSingleUnmountWrapperProps) => {
  const [currentChild, setCurrentChild] = useState<ReactElement>(children);
  const [isUnmounted, setIsUnmounted] = useState<boolean>(false);

  useEffect(() => {
    const isAnimation = isAnimationWrapperChild({ child: children });
    const isCurrentAnimation = isAnimationWrapperChild({ child: currentChild });

    if (isAnimation) {
      setCurrentChild(children);
      setIsUnmounted(false);
    } else if (!isAnimation && isCurrentAnimation) {
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
