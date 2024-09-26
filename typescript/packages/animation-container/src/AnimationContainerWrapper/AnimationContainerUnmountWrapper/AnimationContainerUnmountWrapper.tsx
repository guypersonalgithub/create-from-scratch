import { ReactElement } from "react";
import { AnimationContainerSingleUnmountWrapper } from "./AnimationContainerSingleUnmountWrapper";
import { AnimationContainerMultiUnmountWrapper } from "./AnimationContainerMultiUnmountWrapper";

type AnimationContainerUnmountWrapperProps = {
  changeMethod: "gradual" | "fullPhase";
  children: ReactElement | ReactElement[];
};

export const AnimationContainerUnmountWrapper = ({
  changeMethod,
  children,
}: AnimationContainerUnmountWrapperProps) => {
  if (!children) {
    return null;
  }

  if (!Array.isArray(children)) {
    return (
      <AnimationContainerSingleUnmountWrapper changeMethod={changeMethod}>
        {children}
      </AnimationContainerSingleUnmountWrapper>
    );
  }

  return (
    <AnimationContainerMultiUnmountWrapper changeMethod={changeMethod}>
      {children}
    </AnimationContainerMultiUnmountWrapper>
  );
};
