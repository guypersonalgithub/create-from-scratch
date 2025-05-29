import { useEffect, useState } from "react";
import "./RollingCounter.css";

// TODO: Remake RollingCounter with animation container, its currently not ready for use.

type RollingCounterProps = {
  to: number;
  duration?: number;
  decimals?: number;
};

export const RollingCounter = ({ to, duration = 1000, decimals = 0 }: RollingCounterProps) => {
  const [from, setFrom] = useState(0);
  const [target, setTarget] = useState(to);

  useEffect(() => {
    setFrom(target);
    setTarget(to);
  }, [to]);

  const formatDigits = (num: number) =>
    Math.floor(num).toString().padStart(5, "0").split("").map(Number);

  const fromDigits = formatDigits(from);
  const toDigits = formatDigits(target);

  return (
    <div style={{ display: "flex", fontSize: "2rem" }}>
      {toDigits.map((digit, i) => (
        <Digit key={i} from={fromDigits[i]} to={digit} duration={duration} />
      ))}
    </div>
  );
};

type DigitProps = {
  from: number;
  to: number;
  duration: number;
};

const Digit = ({ from, to, duration }: DigitProps) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const steps = (to - from + 10) % 10;
    const fullHeight = 10 * 1;

    setOffset(from);

    const animationFrame = requestAnimationFrame(() => {
      setOffset(from + steps);
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [from, to]);

  return (
    <div className="digit-container" style={{ height: "1rem", overflow: "hidden" }}>
      <div
        className="digit-strip"
        style={{
          transform: `translateY(-${offset * 100}%)`,
          transition: `transform ${duration}ms ease-in-out`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {[...Array(20)].map((_, i) => (
          <div key={i} style={{ height: "1rem", textAlign: "center" }}>
            {i % 10}
          </div>
        ))}
      </div>
    </div>
  );
};
