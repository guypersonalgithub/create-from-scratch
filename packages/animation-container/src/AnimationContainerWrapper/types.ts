import { CSSProperties, MutableRefObject, ReactNode } from "react";

export type AnimationContainerWrapperProps = {
  keyframes: Keyframe[];
  unMountAnimation?: Keyframe[] | PropertyIndexedKeyframes | null;
  options?: KeyframeAnimationOptions;
  children: ReactNode[] | ReactNode;
  clearAnimationOnExit: MutableRefObject<(() => void) | undefined>;
  style?: CSSProperties;
};
