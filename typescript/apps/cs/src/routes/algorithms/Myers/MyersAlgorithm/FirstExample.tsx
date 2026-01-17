import { ExternalRefProps, MyersStepVisualizer } from "@packages/myers-visualizer";
import { useEffect, useRef } from "react";
import { combinedTrace } from "./constants";

export const FirstExample = () => {
  const ref = useRef<ExternalRefProps>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    for (let i = 0; i < 4; i++) {
      const xBase = 130 + i * 100;

      element.drawRectangle({
        callback: () => {
          return {
            x: xBase,
            y: 0,
            width: 40,
            height: 500,
            color: "blue",
          };
        },
      });
    }

    // for (let i = 0; i < 7; i++) {
    //   const yBase = 85 + i * 57.5;

    //   element.drawRectangle({
    //     callback: () => {
    //       return {
    //         x: 0,
    //         y: yBase,
    //         width: 500,
    //         height: 40,
    //         color: "blue"
    //       };
    //     },
    //   });
    // }
  }, []);

  return (
    <>
      <div>
        Also,{" "}
        <b>
          since k changes by 1 value between each step, it can only be even on even steps, or odd on
          odd steps
        </b>
        . For example, on step 2, k can only be -2, 0 or 2. Its impossible for it to be 1 or -1 as
        that already the value it is expected to be at step 1, it must either increase or decrease
        by 1, and cannot get out of the range mentioned at the last point.
      </div>
      <div>
        That means, that the potential value of k for each step, is based off <b>jumps of 2s</b>.
      </div>
      <MyersStepVisualizer externalRef={ref} trace={combinedTrace} />
    </>
  );
};
