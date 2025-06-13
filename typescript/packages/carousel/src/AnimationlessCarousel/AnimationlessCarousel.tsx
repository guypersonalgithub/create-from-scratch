import { type CarouselProps } from "../types";
import { AutomaticAnimationlessCarousel } from "./AutomaticAnimationlessCarousel";
import { ManualAnimationlessCarousel } from "./ManualAnimationlessCarousel";

export const AnimationlessCarousel = ({
  style,
  items,
  automaticTransition,
  stopTransitionWhenOutOfView,
  transitionDelay,
  displayArrows = true,
  displayIndicators = true,
}: CarouselProps) => {
  if (automaticTransition) {
    return (
      <AutomaticAnimationlessCarousel
        style={style}
        items={items}
        stopTransitionWhenOutOfView={stopTransitionWhenOutOfView}
        transitionDelay={transitionDelay}
        displayArrows={displayArrows}
        displayIndicators={displayIndicators}
      />
    );
  }

  return (
    <ManualAnimationlessCarousel
      style={style}
      items={items}
      displayArrows={displayArrows}
      displayIndicators={displayIndicators}
    />
  );
};
