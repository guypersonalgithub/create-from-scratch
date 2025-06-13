import { type RefObject } from "react";

type AnimateIsolatedTooltipArgs = {
  hovered?: boolean;
  animationRef: RefObject<number>;
  opacity?: number;
  drawTooltip: (opacity: number) => void;
};

export const animateIsolatedTooltip = ({
  hovered,
  animationRef,
  opacity = hovered ? 0 : 1,
  drawTooltip,
}: AnimateIsolatedTooltipArgs) => {
  const target = hovered ? 1 : 0;
  const speed = 0.1;
  opacity += (target - opacity) * speed;

  if (Math.abs(target - opacity) > 0.01) {
    animationRef.current = requestAnimationFrame(() =>
      animateIsolatedTooltip({ hovered, animationRef, opacity, drawTooltip }),
    );
  } else {
    opacity = target;
  }

  drawTooltip(opacity);
};
