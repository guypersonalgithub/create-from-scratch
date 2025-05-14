import { CSSProperties, ReactNode } from "react";

export type AnimationlessCarouselProps = {
  style?: CSSProperties;
  items: ReactNode[];
  displayArrows?: boolean;
  displayIndicators?: boolean;
} & Transition;

type Transition =
  | {
      automaticTransition?: true;
      stopTransitionWhenOutOfView?: boolean;
      transitionDelay?: number;
    }
  | {
      automaticTransition?: never;
      stopTransitionWhenOutOfView?: never;
      transitionDelay?: never;
    };
