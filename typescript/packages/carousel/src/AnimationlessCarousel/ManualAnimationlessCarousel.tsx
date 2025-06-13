import { useState } from "react";
import { type CarouselProps } from "../types";
import { AnimationlessContent } from "./AnimationlessContent";

type ManualCarouselProps = Omit<
  CarouselProps,
  "automaticTransition" | "stopTransitionWhenOutOfView" | "transitionDelay"
>;

export const ManualAnimationlessCarousel = ({
  style,
  items,
  displayArrows,
  displayIndicators,
}: ManualCarouselProps) => {
  const [stage, setStage] = useState(0);

  return (
    <AnimationlessContent
      style={style}
      items={items}
      displayArrows={displayArrows}
      displayIndicators={displayIndicators}
      stage={stage}
      setStage={setStage}
    />
  );
};
