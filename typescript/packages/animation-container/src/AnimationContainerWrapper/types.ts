import { CSSProperties, MutableRefObject, ReactElement } from "react";

export interface CSSPropertiesWithIndex extends CSSProperties {
  [key: string]: string | number | undefined;
}

export type ChangeMethod = "gradual" | "fullPhase";

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
  changeMethod?: ChangeMethod;
};

type WithoutMount = {
  onMount?: never;
  mountOptions?: never;
  changeMethod?: never;
};

type WithUnmount = {
  onUnmount?: Keyframe[];
  unmountOptions?: KeyframeAnimationOptions;
  changeMethod?: ChangeMethod;
};

type WithoutUnmount = {
  onUnmount?: never;
  unmountOptions?: never;
  changeMethod?: never;
};

type WithAnimation = {
  animation?: Keyframe[];
  animationOptions?: KeyframeAnimationOptions;
};

type WithoutAnimation = {
  animation?: never;
  animationOptions?: never;
};
