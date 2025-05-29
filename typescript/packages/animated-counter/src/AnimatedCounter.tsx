import { useEffect, useRef, useState } from "react";

type AnimatedCounterProps = {
  from: number;
  to: number;
  duration?: number;
  decimals?: number;
};

export const AnimatedCounter = ({
  from,
  to,
  duration = 2000,
  decimals = 0,
}: AnimatedCounterProps) => {
  const [current, setCurrent] = useState(from);
  const start = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const increaseCallback = ({ progress }: { progress: number }) => {
      const value = to * progress;
      return value;
    };
    const decreaseCallback = ({ progress }: { progress: number }) => {
      const value = from * (1 - progress);
      return value;
    };

    const step = (timestamp: number, callback: ({ progress }: { progress: number }) => number) => {
      if (start.current === null) {
        start.current = timestamp;
      }

      const progress = Math.min((timestamp - start.current) / duration, 1);
      const value = callback({ progress });
      setCurrent(value);
      if (progress < 1) {
        animationRef.current = requestAnimationFrame((timestamp) => step(timestamp, callback));
      }
    };

    animationRef.current = requestAnimationFrame((timestamp) =>
      step(timestamp, to > from ? increaseCallback : decreaseCallback),
    );

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [from, to, duration]);

  return <span>{current.toFixed(decimals)}</span>;
};
