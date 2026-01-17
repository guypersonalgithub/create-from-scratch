import { ExternalRefProps, MyersStepVisualizer } from "@packages/myers-visualizer";
import { useEffect, useRef } from "react";
import { myersConstants } from "../constants";

export const SecondExample = () => {
  const { traces } = myersConstants;
  const ref = useRef<ExternalRefProps>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

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
        Via a similar process, to move back from (d , k) = (3 , 1) we must have come from (2 , 2) or
        (2 , 0).
      </div>
      <div>
        (2 , 2)'s x is 3 while (2 , 0)'s x is 2, so we know we reached here from (2 , 2) via a
        downward move from (x , y) = (3 , 1).
      </div>
      <MyersStepVisualizer externalRef={ref} trace={traces} isSwitched keepPathsOf={[7, 9, 4]} />
    </>
  );
};
