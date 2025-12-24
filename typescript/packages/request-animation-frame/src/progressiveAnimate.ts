type progressiveAnimateArgs = {
  animationStart: number | null;
  callback: (props: { progress: number }) => void;
  animationDuration: number;
  onEnd?: () => void;
};

export const progressiveAnimate = ({
  animationStart,
  callback,
  animationDuration,
  onEnd,
}: progressiveAnimateArgs) => {
  const animate = (timestamp: number) => {
    if (animationStart === null) {
      animationStart = timestamp;
    }

    const elapsed = timestamp - animationStart;
    const progress = Math.min(elapsed / animationDuration, 1);

    callback({ progress });

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      onEnd?.();
    }
  };

  return animate;
};
