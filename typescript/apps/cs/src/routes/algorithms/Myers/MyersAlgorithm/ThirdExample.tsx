import { ExternalRefProps, MyersStepVisualizer } from "@packages/myers-visualizer";
import { useEffect, useRef } from "react";

export const ThirdExample = () => {
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
        const fromY = yPositions[-3];
        const toY = yPositions[-4];

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
        If k = -d that would mean we are expected to be at the position (d , -d) which means it
        maximized insertions over deletions. For that same reason, that would mean the last step was
        (d - 1, k + 1), and that would mean the step must be downward (as d - 1, -d + 1 - 1), while
        going rightward (d - 1, -d + 1 + 1) would mean we wouldn't reach the current k, which is an
        illegal move.
      </div>
      <div>
        If we tried to move rightward with k = -d, that would mean the previous step is (d - 1, -d -
        1) which isn't possible, as -d is the possible current step limit.
      </div>
      <MyersStepVisualizer
        externalRef={ref}
        trace={[
          { from: { x: 0, y: 0 }, to: { x: 0, y: 1 }, step: 0 },
          { from: { x: 0, y: 1 }, to: { x: 0, y: 2 }, step: 1 },
          { from: { x: 0, y: 2 }, to: { x: 0, y: 3 }, step: 2 },
          { from: { x: 0, y: 4 }, to: { x: 0, y: 3 }, step: 2 },
        ]}
      />
    </>
  );
};
