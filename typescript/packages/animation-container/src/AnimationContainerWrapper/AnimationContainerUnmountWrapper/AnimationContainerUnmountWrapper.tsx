import { ReactElement } from "react";
import { AnimationContainerSingleUnmountWrapper } from "~/AnimationContainerWrapper/AnimationContainerUnmountWrapper/AnimationContainerSingleUnmountWrapper";
import { AnimationContainerMultiUnmountWrapper } from "~/AnimationContainerWrapper/AnimationContainerUnmountWrapper/AnimationContainerMultiUnmountWrapper";
import { ChangeMethod } from "~/AnimationContainerWrapper/types";

type AnimationContainerUnmountWrapperProps = {
  changeMethod: ChangeMethod;
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
