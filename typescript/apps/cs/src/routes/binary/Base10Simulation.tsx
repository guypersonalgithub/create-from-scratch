import {
  ContinuedCallback,
  convertNumberToBinary,
  simulateConvertNumberToBinaryBySteps,
} from "@packages/binary";
import { useState, useEffect, useRef } from "react";
import { OffLightbulb, OnLightbulb } from "@packages/icons";

type Base10SimulationProps = {
  startFrom: number;
  to: number;
};

type ContinueCallbackArgs = {
  base: string;
  num: number;
  continuedCallback: ContinuedCallback;
};

export const Base10Simulation = ({ startFrom, to }: Base10SimulationProps) => {
  const [value, setValue] = useState<{ result: string; num: number }>(() => {
    const result = convertNumberToBinary({ num: startFrom });

    return {
      result,
      num: startFrom,
    };
  });
  const timeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const continueCallback = ({ base, num, continuedCallback }: ContinueCallbackArgs) => {
      timeout.current = setTimeout(() => {
        const { base: newBase, num: newNum } =
          continuedCallback({ base, startFrom: num, num: to }) ?? {};

        if (newBase && newNum) {
          setValue({ result: newBase, num: newNum });
          continueCallback({ base: newBase, num: newNum, continuedCallback });
        }
      }, 1000);
    };

    timeout.current = setTimeout(
      () =>
        simulateConvertNumberToBinaryBySteps({
          startFrom,
          callback: ({ result, num, continuedCallback }) => {
            const { base, num: newNum } =
              continuedCallback({ base: result, startFrom: num, num: to }) ?? {};
            if (base && newNum) {
              setValue({ result: base, num: newNum });
              continueCallback({ base, num: newNum, continuedCallback });
            }
          },
        }),
      1000,
    );

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [startFrom, to]);

  return (
    <div>
      <div style={{ display: "flex", gap: "10px" }}>
        <div>Number:</div>
        <div>{value?.num ?? null}</div>
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <div>Binary:</div>
        <div>
          {value?.result?.split("").map((char, index) => {
            if (char === "1") {
              return <OnLightbulb key={index} size={24} style={{ color: "yellow" }} />;
            }

            return <OffLightbulb key={index} style={{ color: "white" }} size={24} />;
          }) ?? null}
        </div>
      </div>
    </div>
  );
};
