import { AnimationContainerWrapperProps } from "./types";
import { SingleChildContainerWrapper } from "./SingleChildContainerWrapper";
import { MultiChildrenContainerWrapper } from "./MultiChildrenContainerWrapper";
import { useEffect, useRef } from "react";
import { useIsDev } from "@packages/is-dev";

export const AnimationContainerWrapper = ({
  children,
  from,
  to,
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
        from={from}
        to={to}
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
      from={from}
      to={to}
      options={options}
      clearAnimationOnExit={clearAnimationOnExitRef}
      style={style}
    >
      {children}
    </MultiChildrenContainerWrapper>
  );
};
