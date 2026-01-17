import { ExternalRefProps, MyersStepVisualizer } from "@packages/myers-visualizer";
import { useEffect, useRef } from "react";

export const FirstExample = () => {
  const ref = useRef<ExternalRefProps>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    element.drawRectangle({
      callback: ({ xPositions, yPositions }) => {
        const x = xPositions[1] - 20;
        const y = yPositions[-1] + 20;

        return {
          x,
          y,
          width: 40,
          height: yPositions[1] - y - 20,
          color: "blue",
        };
      },
    });

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
  }, []);

  return (
    <>
      <div>
        Let's say we consider the move (d , k) = (2 , 0). We can either move rightward from (d , k)
        = (1 , -1) where (x , y) = (1 , 2) or downward from (d , k) = (1 , 1) where (x , y) = (2 ,
        1)
      </div>
      <MyersStepVisualizer
        externalRef={ref}
        trace={[
          { from: { x: 0, y: 0 }, to: { x: 2, y: 1 }, step: 0 },
          { from: { x: 0, y: 0 }, to: { x: 1, y: 2 }, step: 0 },
          { from: { x: 2, y: 1 }, to: { x: 2, y: 2 }, step: 1 },
          { from: { x: 1, y: 2 }, to: { x: 2, y: 2 }, step: 1 },
        ]}
      />
      <div>
        Since (2 , 1) has a higher x value than (1 , 2) we pick a move downward from (2 , 1) to (2 ,
        2). Therefore we record (x , y) = (2 , 2) for (d , k) = (2 , 0).
      </div>
      <div>
        That explains why we record the move via this path when (2 , 0) is also reachable going
        rightward from (1 , 2) - picking the previous position with the highest x value means we try
        to maximize the number of deletions we make before trying insertions.
      </div>
    </>
  );
};
