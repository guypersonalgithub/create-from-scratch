import { ExternalRefProps, MyersStepVisualizer } from "@packages/myers-visualizer";
import { useEffect, useRef } from "react";
import { myersConstants } from "../constants";

export const FirstExample = () => {
  const { traces } = myersConstants;
  const ref = useRef<ExternalRefProps>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    element.drawCircle({
      callback: ({ xPositions, yPositions }) => {
        const xFirst = xPositions[3];
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
        We know that the final position is at (x , y) = (4 , 4), as (d , k) = (4, 0), so we can
        track back to either (3 , 1) or (3 , -1).
      </div>
      <div>
        (3 , 1)'s x is 4 and (3 , -1)'s is 3, so (3 , 1) has a higher x value, which means we must
        have reached (4 , 0) via a downward move from there. This tells us that the (x , y) position
        before (4 , 4) was (4 , 3).
      </div>
      <MyersStepVisualizer externalRef={ref} trace={traces} isSwitched keepPathsOf={[7, 11]} />
    </>
  );
};
