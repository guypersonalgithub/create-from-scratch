import { ExternalRefProps, MyersStepVisualizer } from "@packages/myers-visualizer";
import { useEffect, useRef } from "react";
import { combinedTrace } from "./constants";

export const SecondExample = () => {
  const ref = useRef<ExternalRefProps>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    element.drawCircle({
      callback: ({ xPositions, yPositions }) => {
        const xFirst = xPositions[1];
        const yFirst = yPositions[1];

        return {
          xFirst,
          yFirst,
          radius: 30,
        };
      },
    });

    element.drawRectangle({
      callback: ({ xPositions, yPositions }) => {
        const x = xPositions[2] - 20;
        const y = yPositions[2] - 20;

        return {
          x,
          y,
          width: 40,
          height: yPositions[0] - y + 20,
          color: "blue",
        };
      },
    });

    element.drawCircle({
      callback: ({ xPositions, yPositions }) => {
        const xFirst = xPositions[2];
        const yFirst = yPositions[2];

        return {
          xFirst,
          yFirst,
          radius: 30,
        };
      },
    });
  }, []);

  return (
    <>
      <div>
        The aim with d and k is to determine the best move we can do from the last step.{" "}
        <b>
          The best move is a one with the highest possible k, which means it maximizes deletions as
          opposed to insertions (k = x - y), x represents deletions, y insertions.
        </b>
      </div>
      <MyersStepVisualizer externalRef={ref} trace={combinedTrace} />
    </>
  );
};
