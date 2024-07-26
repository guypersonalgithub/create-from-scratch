import { AnimationContainerWrapperProps } from "./types";
import { SingleChildContainerWrapper } from "./SingleChildContainerWrapper";
import { MultiChildrenContainerWrapper } from "./MultiChildrenContainerWrapper";
import { useEffect, useRef } from "react";
import { useIsDev } from "@packages/is-dev";

export const AnimationContainerWrapper = ({
  children,
  keyframes,
  options,
  style,
}: Omit<AnimationContainerWrapperProps, "clearAnimationOnExit">) => {
  const clearAnimationOnExitRef = useRef<() => void>();
  const { isDev } = useIsDev();

  useEffect(() => {
    return () => {
      if (isDev) {
        return;
      }

      clearAnimationOnExitRef.current?.();
    };
  }, [isDev]);

  if (!Array.isArray(children)) {
    return (
      <SingleChildContainerWrapper
        keyframes={keyframes}
        options={options}
        clearAnimationOnExit={clearAnimationOnExitRef}
        style={style}
      >
        {children}
      </SingleChildContainerWrapper>
    );
  }

  return (
    <MultiChildrenContainerWrapper
      keyframes={keyframes}
      options={options}
      clearAnimationOnExit={clearAnimationOnExitRef}
      style={style}
    >
      {children}
    </MultiChildrenContainerWrapper>
  );
};
