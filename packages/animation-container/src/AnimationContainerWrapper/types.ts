import { CSSProperties, MutableRefObject, ReactElement } from "react";

export type AnimationContainerWrapperProps = {
  onMount?: Keyframe[];
  onUnmount?: Keyframe[];
  options?: KeyframeAnimationOptions;
  children: ReactElement[] | ReactElement;
  clearAnimationOnExit: MutableRefObject<(() => void)[]>;
  style?: CSSProperties;
};
