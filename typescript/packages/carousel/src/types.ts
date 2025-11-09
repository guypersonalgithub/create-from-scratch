import { type CSSProperties, type ReactNode } from "react";

export type CarouselProps = {
  className?: string;
  style?: CSSProperties;
  items: ReactNode[];
} & Displays &
  Transition;

export type Displays = {
  displayArrows?: boolean;
  displayIndicators?: boolean;
};

export type Transition =
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
