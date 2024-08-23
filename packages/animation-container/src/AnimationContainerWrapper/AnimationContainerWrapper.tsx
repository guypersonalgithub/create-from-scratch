import { AnimationContainerWrapperProps } from "./types";
import { SingleChildContainerWrapper } from "./SingleChildContainerWrapper";
import { MultiChildrenContainerWrapper } from "./MultiChildrenContainerWrapper";
import { useContext, useEffect, useRef } from "react";
import { useIsDev } from "@packages/is-dev";
import { UnmountContext } from "./AnimationContainerUnmountWrapper/unmountContext";

export const AnimationContainerWrapper = ({
  children,
  onMount,
  onUnmount,
  options,
  style,
}: Omit<AnimationContainerWrapperProps, "clearAnimationOnExit">) => {
  const wrapper = useContext(UnmountContext);
  const clearAnimationOnExitRef = useRef<(() => void)[]>([]);
  const { isDev } = useIsDev();

  useEffect(() => {
    return () => {
      if (isDev) {
        return;
      }

      clearAnimationOnExitRef.current?.forEach((clearCallback) => {
        clearCallback();
      });
    };
  }, [isDev]);

  if (!Array.isArray(children)) {
    return (
      <SingleChildContainerWrapper
        onMount={onMount}
        onUnmount={onUnmount}
        options={options}
        clearAnimationOnExit={clearAnimationOnExitRef}
        style={style}
        isUnmounted={!!wrapper?.isUnmounted}
        finishedAnimation={wrapper?.finishedAnimation}
      >
        {children}
      </SingleChildContainerWrapper>
    );
  }

  return (
    <MultiChildrenContainerWrapper
      onMount={onMount}
      onUnmount={onUnmount}
      options={options}
      clearAnimationOnExit={clearAnimationOnExitRef}
      style={style}
      isUnmounted={!!wrapper?.isUnmounted}
      finishedAnimation={wrapper?.finishedAnimation}
    >
      {children}
    </MultiChildrenContainerWrapper>
  );
};
