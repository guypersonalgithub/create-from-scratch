import { CSSProperties, RefObject, ReactElement } from "react";

export interface CSSPropertiesWithIndex extends CSSProperties {
  [key: string]: string | number | undefined;
}

export type ChangeMethod = "gradual" | "fullPhase";

export type AnimationContainerWrapperProps = {
  children: ReactElement[] | ReactElement;
  clearLifeCycleAnimationOnExitRef: RefObject<(() => void)[]>;
  style?: CSSProperties;
  styleOnceAnimating?: CSSProperties;
  onMountAnimationStart?: () => void;
  onMountAnimationEnd?: () => void;
  onUnmountAnimationStart?: () => void;
  onUnmountAnimationEnd?: () => void;
  disableLifeCycleAnimations?: boolean;
  externalRef?: RefObject<HTMLDivElement | null>;
  disableMountAnimationOnInit?: boolean;
  disabledMountAnimationOnInit: boolean;
} & (WithMount | WithoutMount) &
  (WithUnmount | WithoutUnmount);

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
