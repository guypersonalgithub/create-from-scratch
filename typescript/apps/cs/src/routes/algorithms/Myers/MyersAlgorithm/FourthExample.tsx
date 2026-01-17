import { ExternalRefProps, MyersStepVisualizer } from "@packages/myers-visualizer";
import { useEffect, useRef } from "react";

export const FourthExample = () => {
  const ref = useRef<ExternalRefProps>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    element.drawX({
      callback: ({ xPositions, yPositions }) => {
        const fromX = xPositions[3];
        const toX = xPositions[2];
        const fromY = yPositions[4];
        const toY = yPositions[3];

        return {
          from: { x: fromX, y: fromY },
          to: { x: toX, y: toY },
        };
      },
    });
  }, []);

  return (
    <>
      <div>
        If k = +d and we want to reach (d , d) from (d - 1, d - 1), that would mean we maximized
        deletions over iserations. For that same reason that would mean the last step was (d - 1, k
        - 1), and that would mean the step must be rightward (as d - 1, d - 1 + 1), while going
        downward (d - 1, d - 1 - 1) would mean we wouldn't reach the current k which is an illegal
        move.
      </div>
      <div>
        If we tried to move downward with k = +d, that would mean the previous step is (d - 1, d +
        1) which isn't possible as +d is the possible current step limit.
      </div>
      <MyersStepVisualizer
        externalRef={ref}
        trace={[
          { from: { x: 0, y: 0 }, to: { x: 1, y: 0 }, step: 0 },
          { from: { x: 1, y: 0 }, to: { x: 2, y: 0 }, step: 1 },
          { from: { x: 2, y: 0 }, to: { x: 3, y: 0 }, step: 2 },
          { from: { x: 4, y: 0 }, to: { x: 3, y: 0 }, step: 2 },
        ]}
      />
    </>
  );
};
