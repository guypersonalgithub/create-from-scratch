import { type CarouselProps } from "../types";
import { AutomaticAnimationlessCarousel } from "./AutomaticAnimationlessCarousel";
import { ManualAnimationlessCarousel } from "./ManualAnimationlessCarousel";

export const AnimationlessCarousel = ({
  className,
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
        className={className}
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
      className={className}
      style={style}
      items={items}
      displayArrows={displayArrows}
      displayIndicators={displayIndicators}
    />
  );
};
