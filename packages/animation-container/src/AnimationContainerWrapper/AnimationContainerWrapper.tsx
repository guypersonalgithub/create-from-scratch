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
}: AnimationContainerWrapperProps) => {
  const animationRef = useRef<Animation>();
  const previousAnimationRefs = useRef<Animation[]>([]);
  const { isDev } = useIsDev();

  useEffect(() => {
    return () => {
      if (isDev) {
        return;
      }

      animationRef.current?.cancel();
      previousAnimationRefs.current.forEach((animationRef) => {
        animationRef.cancel();
      });
    };
  }, []);

  if (!Array.isArray(children)) {
    return (
      <SingleChildContainerWrapper
        from={from}
        to={to}
        options={options}
        animationRef={animationRef}
        previousAnimationRefs={previousAnimationRefs}
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
      animationRef={animationRef}
      previousAnimationRefs={previousAnimationRefs}
    >
      {children}
    </MultiChildrenContainerWrapper>
  );
};
