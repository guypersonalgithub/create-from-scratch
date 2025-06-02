import { Dispatch, SetStateAction, useState } from "react";
import { AnimatedCarouselProps } from "./types";
import { AnimatedContent } from "./AnimatedContent";

type ManualAnimatedCarouselProps = Omit<
  AnimatedCarouselProps,
  "automaticTransition" | "stopTransitionWhenOutOfView" | "transitionDelay"
>;

export const ManualAnimatedCarousel = ({
  style,
  items,
  displayArrows,
  displayIndicators,
  direction = "right",
}: ManualAnimatedCarouselProps) => {
  const [stage, setStage] = useState(0);
  const [followupTransitions, setFollowupTransitions] = useState<number[]>([]);
  const [currentDirection, setCurrentDirection] = useState(direction);
  const lastItemIndex = items.length - 1;
  const isDirectionRight = currentDirection === "right";
  const disabled = followupTransitions.length > 0;

  return (
    <AnimatedContent
      style={style}
      items={items}
      displayArrows={displayArrows}
      displayIndicators={displayIndicators}
      stage={stage}
      setStage={setStage}
      followupTransitions={followupTransitions}
      setFollowupTransitions={setFollowupTransitions}
      direction={direction}
      disabled={disabled}
      currentDirection={currentDirection}
      setCurrentDirection={setCurrentDirection}
      isDirectionRight={isDirectionRight}
      lastItemIndex={lastItemIndex}
    />
  );
};
