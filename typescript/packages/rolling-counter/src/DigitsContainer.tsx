import { useState, useEffect, useRef } from "react";
import { Digit } from "./Digit";
import { padNumberStart } from "@packages/number-utils";
import { dynatic } from "@packages/dynatic-css";

type DigitsContainerProps = {
  initial: number[];
  from: number;
  to: number;
  duration: number;
};

export const DigitsContainer = ({ initial, from, to, duration }: DigitsContainerProps) => {
  const [current, setCurrent] = useState(initial);
  const start = useRef<number>(from);
  const timeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const increaseCallback = () => {
      start.current++;

      return start.current;
    };
    const decreaseCallback = () => {
      start.current--;

      return start.current;
    };

    const step = (callback: () => number) => {
      const value = callback();
      setCurrent(
        padNumberStart({
          num: Math.floor(value),
          amountOfPaddings: current.length,
          padString: "0",
        }),
      );
      if (from < to) {
        timeout.current = setTimeout(() => {
          step(callback);
        }, duration);
      }
    };

    timeout.current = setTimeout(() => {
      step(to > from ? increaseCallback : decreaseCallback);
    }, duration);

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [from, to]);

  return (
    <div
      className={dynatic`
        display: flex;
        align-items: center;
        overflow: hidden;
        height: 1.5rem;
      `}
    >
      {current.map((value, index) => {
        return <Digit key={index} num={value} duration={duration} />;
      })}
    </div>
  );
};
