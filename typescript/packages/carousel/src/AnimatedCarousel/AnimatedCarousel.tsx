import { type AnimatedCarouselProps } from "./types";
import { ManualAnimatedCarousel } from "./ManualAnimatedCarousel";
import { AutomaticAnimatedCarousel } from "./AutomaticAnimatedCarousel";

export const AnimatedCarousel = ({
  style,
  items,
  automaticTransition,
  stopTransitionWhenOutOfView,
  transitionDelay = 3000,
  displayArrows = true,
  displayIndicators = true,
}: AnimatedCarouselProps) => {
  if (automaticTransition) {
    return (
      <AutomaticAnimatedCarousel
        style={style}
        items={items}
        displayArrows={displayArrows}
        displayIndicators={displayIndicators}
        stopTransitionWhenOutOfView={stopTransitionWhenOutOfView}
        transitionDelay={transitionDelay}
      />
    );
  }

  return (
    <ManualAnimatedCarousel
      style={style}
      items={items}
      displayArrows={displayArrows}
      displayIndicators={displayIndicators}
    />
  );
};
