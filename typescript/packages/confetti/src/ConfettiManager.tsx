import { useState, useEffect, useRef } from "react";
import type { ConfettiDisplayProps } from "./types";
import { Confetti } from "./Confetti";

/* TODO: This feels like a naive approach. 
Should consider instead of managing this through a state, to potentially have a single canvas, with a has confetti true/false to rerender.
Custom events would dictate where new confetti should be appearing on the screen, and multiple confetti groups should be able to be animated at once with different properties.
*/

export const ConfettiManager = () => {
  const [confetti, setConfetti] = useState<ConfettiDisplayProps[]>([]);
  const confettiIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const showConfetti = (event: CustomEvent<ConfettiDisplayProps>) => {
      const { id, className, style, x, y, particleCount, spread, size, gravity, colors } =
        event.detail;

      setConfetti((prev) => {
        const updated = [...prev];
        const index = prev.findIndex((tooltip) => tooltip.id === id);
        const tooltipContent = {
          id,
          className,
          style,
          x,
          y,
          particleCount,
          spread,
          size,
          gravity,
          colors,
        };
        if (index > -1) {
          updated[index] = tooltipContent;
        } else {
          updated.push(tooltipContent);
        }

        return updated;
      });
      confettiIds.current.add(id);
    };

    const deleteConfetti = () => {
      confettiIds.current = new Set();
      setConfetti([]);
    };

    window.addEventListener("showConfetti", showConfetti as EventListener);
    window.addEventListener("deleteConfetti", deleteConfetti as EventListener);

    return () => {
      window.removeEventListener("showConfetti", showConfetti as EventListener);
      window.removeEventListener("deleteConfetti", deleteConfetti as EventListener);
    };
  }, []);

  return confetti.map((conf) => {
    const { id, ...rest } = conf;

    return (
      <Confetti
        key={id}
        {...rest}
        removeConfetti={() => setConfetti((prev) => prev.filter((conf) => conf.id !== id))}
      />
    );
  });
};
