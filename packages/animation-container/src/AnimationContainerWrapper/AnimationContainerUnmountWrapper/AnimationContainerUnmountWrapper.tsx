import { ReactElement } from "react";
import { AnimationContainerSingleUnmountWrapper } from "./AnimationContainerSingleUnmountWrapper";
import { AnimationContainerMultiUnmountWrapper } from "./AnimationContainerMultiUnmountWrapper";

type AnimationContainerUnmountWrapperProps = {
  children: ReactElement | ReactElement[];
};

export const AnimationContainerUnmountWrapper = ({
  children,
}: AnimationContainerUnmountWrapperProps) => {
  if (!Array.isArray(children)) {
    return (
      <AnimationContainerSingleUnmountWrapper>{children}</AnimationContainerSingleUnmountWrapper>
    );
  }

  return <AnimationContainerMultiUnmountWrapper>{children}</AnimationContainerMultiUnmountWrapper>;
};
