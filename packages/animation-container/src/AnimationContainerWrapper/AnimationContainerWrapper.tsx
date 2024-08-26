import { AnimationContainerWrapperProps } from "./types";
import { SingleChildContainerWrapper } from "./SingleChildContainerWrapper";
import { MultiChildrenContainerWrapper } from "./MultiChildrenContainerWrapper";
import { useContext, useEffect, useRef } from "react";
import { useIsDev } from "@packages/is-dev";
import { UnmountContext } from "./AnimationContainerUnmountWrapper/unmountContext";

export const AnimationContainerWrapper = ({
  children,
  changeMethod,
  ...rest
}: Omit<
  AnimationContainerWrapperProps,
  "clearLifeCycleAnimationOnExitRef" | "clearAnimationOnExitRef"
> & {
  changeMethod: "gradual" | "fullPhase";
}) => {
  const wrapper = useContext(UnmountContext);
  const clearLifeCycleAnimationOnExitRef = useRef<(() => void)[]>([]);
  const clearAnimationOnExitRef = useRef<(() => void)[]>([]);
  const { isDev } = useIsDev();

  useEffect(() => {
    return () => {
      if (isDev) {
        return;
      }

      clearLifeCycleAnimationOnExitRef.current?.forEach((clearCallback) => {
        clearCallback();
      });

      clearAnimationOnExitRef.current?.forEach((clearCallback) => {
        clearCallback();
      });
    };
  }, [isDev]);

  if (!children) {
    return null;
  }

  if (!Array.isArray(children)) {
    return (
      <SingleChildContainerWrapper
        clearLifeCycleAnimationOnExitRef={clearLifeCycleAnimationOnExitRef}
        clearAnimationOnExitRef={clearAnimationOnExitRef}
        isUnmounted={!!wrapper?.isUnmounted}
        finishedAnimation={wrapper?.finishedAnimation}
        changeMethod={changeMethod}
        {...rest}
      >
        {children}
      </SingleChildContainerWrapper>
    );
  }

  return (
    <MultiChildrenContainerWrapper
      clearLifeCycleAnimationOnExitRef={clearLifeCycleAnimationOnExitRef}
      clearAnimationOnExitRef={clearAnimationOnExitRef}
      isUnmounted={!!wrapper?.isUnmounted}
      finishedAnimation={wrapper?.finishedAnimation}
      changeMethod={changeMethod}
      {...rest}
    >
      {children}
    </MultiChildrenContainerWrapper>
  );
};
