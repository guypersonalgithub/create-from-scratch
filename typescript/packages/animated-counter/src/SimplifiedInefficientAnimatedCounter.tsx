import { useEffect, useState } from "react";

type SimplifiedInefficientAnimatedCounterProps = {
  from: number;
  to: number;
  decimals?: number;
};

export const SimplifiedInefficientAnimatedCounter = ({
  from,
  to,
  decimals = 0
}: SimplifiedInefficientAnimatedCounterProps) => {
  const [current, setCurrent] = useState(from);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => {
        if (prev === to) {
          return to;
        }

        return prev + (prev < to ? 1 : -1);
      });
    }, 50);
    return () => clearInterval(interval);
  }, [to]);

  return <span>{current.toFixed(decimals)}</span>;
};
