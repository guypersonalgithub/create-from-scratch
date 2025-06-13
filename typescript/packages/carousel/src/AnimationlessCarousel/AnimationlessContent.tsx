import { type Dispatch, type RefObject, type SetStateAction } from "react";
import { type CarouselProps } from "../types";
import { CarouselContent } from "../CarouselContent";

type AnimationlessContentProps = Omit<
  CarouselProps,
  "automaticTransition" | "stopTransitionWhenOutOfView" | "transitionDelay"
> & {
  contentRef?: RefObject<HTMLDivElement | null>;
  stage: number;
  setStage: Dispatch<SetStateAction<number>>;
};

export const AnimationlessContent = ({
  contentRef,
  style,
  items,
  displayArrows,
  displayIndicators,
  stage,
  setStage,
}: AnimationlessContentProps) => {
  return (
    <CarouselContent
      contentRef={contentRef}
      style={style}
      items={items}
      stage={stage}
      onLeftArrowClick={setStage}
      onRightArrowClick={setStage}
      onIndicatorClick={setStage}
      displayArrows={displayArrows}
      displayIndicators={displayIndicators}
    >
      {items[stage] ?? null}
    </CarouselContent>
  );
};
