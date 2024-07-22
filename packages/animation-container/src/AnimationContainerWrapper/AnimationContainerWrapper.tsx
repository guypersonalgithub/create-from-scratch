import { AnimationContainerWrapperProps } from "./types";
import { SingleChildContainerWrapper } from "./SingleChildContainerWrapper";
import { MultiChildrenContainerWrapper } from "./MultiChildrenContainerWrapper";
import { useEffect, useRef } from "react";

export const AnimationContainerWrapper = ({
  children,
  from,
  to,
  options,
}: AnimationContainerWrapperProps) => {
  const animationRef = useRef<Animation>();
  const previousAnimationRefs = useRef<Animation[]>([]);

  useEffect(() => {
    return () => {
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
