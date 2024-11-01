import { CSSProperties, MutableRefObject, ReactElement } from "react";

export interface CSSPropertiesWithIndex extends CSSProperties {
  [key: string]: string | number | undefined;
}

export type AnimationContainerWrapperProps = {
  children: ReactElement[] | ReactElement;
  clearLifeCycleAnimationOnExitRef: MutableRefObject<(() => void)[]>;
  clearAnimationOnExitRef: MutableRefObject<(() => void)[]>;
  style?: CSSProperties;
  onMountAnimationStart?: () => void;
  onMountAnimationEnd?: () => void;
  onUnmountAnimationStart?: () => void;
  onUnmountAnimationEnd?: () => void;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  disableLifeCycleAnimations?: boolean;
  disableAnimation?: boolean;
} & (WithMount | WithoutMount) &
  (WithUnmount | WithoutUnmount) &
  (WithAnimation | WithoutAnimation);

type WithMount = {
  onMount?: Keyframe[];
  mountOptions?: KeyframeAnimationOptions;
};

type WithoutMount = {
  onMount?: never;
  mountOptions?: never;
};

type WithUnmount = {
  onUnmount?: Keyframe[];
  unmountOptions?: KeyframeAnimationOptions;
};

type WithoutUnmount = {
  onUnmount?: never;
  unmountOptions?: never;
};

type WithAnimation = {
  animation?: Keyframe[];
  animationOptions?: KeyframeAnimationOptions;
};

type WithoutAnimation = {
  animation?: never;
  animationOptions?: never;
};
