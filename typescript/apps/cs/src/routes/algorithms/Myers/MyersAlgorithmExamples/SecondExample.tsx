import { ExternalRefProps, MyersStepVisualizer } from "@packages/myers-visualizer";
import { useEffect, useRef } from "react";

export const SecondExample = () => {
  const ref = useRef<ExternalRefProps>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    element.drawRectangle({
      callback: ({ xPositions, yPositions }) => {
        const x = xPositions[2] - 20;
        const y = yPositions[0] - 20;

        return {
          x,
          y,
          width: 40,
          height: yPositions[-2] - y + 20,
          color: "blue",
        };
      },
    });

    element.drawCircle({
      callback: ({ xPositions, yPositions }) => {
        const xFirst = xPositions[2];
        const yFirst = yPositions[-2];

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
        In some situations the two previous positions will have the same x value. For example, (d ,
        k) = (3 , -1) where we can move downward from (x , y) = (2 , 2) or rightward from (x , y) =
        (2 , 4).{" "}
        <b>
          Moving rightward will increase x so we move from (2 , 4) to (3 , 4) and then diagonally to
          (4 , 5).
        </b>
        <MyersStepVisualizer
          externalRef={ref}
          trace={[
            { from: { x: 0, y: 0 }, to: { x: 1, y: 0 }, step: 0 },
            { from: { x: 0, y: 0 }, to: { x: 0, y: 1 }, step: 0 },
            { from: { x: 0, y: 1 }, to: { x: 2, y: 4 }, step: 1 },
            { from: { x: 2, y: 4 }, to: { x: 4, y: 5 }, step: 2 },
            { from: { x: 1, y: 0 }, to: { x: 3, y: 1 }, step: 1 },
            { from: { x: 1, y: 0 }, to: { x: 2, y: 2 }, step: 1 },
            { from: { x: 2, y: 2 }, to: { x: 4, y: 5 }, step: 2 },
          ]}
        />
      </div>
    </>
  );
};
