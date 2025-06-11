import { convertNumberToBinary } from "./convertNumberToBinary";

type ContinuedCallbackArgs = {
  num: number;
  base: string;
  startFrom: number;
};

export type ContinuedCallback = (
  args: ContinuedCallbackArgs,
) => undefined | { base: string; num: number };

type SimulateConvertNumberToBinaryByStepsArgs = {
  startFrom?: number;
  callback: (args: { result: string; num: number; continuedCallback: ContinuedCallback }) => void;
};

export const simulateConvertNumberToBinaryBySteps = ({
  startFrom = 0,
  callback,
}: SimulateConvertNumberToBinaryByStepsArgs) => {
  let base = convertNumberToBinary({ num: startFrom });

  callback({
    result: base,
    num: startFrom,
    continuedCallback: ({ num, base, startFrom }: ContinuedCallbackArgs) => {
      if (startFrom >= num) {
        return;
      }

      let updated = false;
      for (let i = base.length - 1; i >= 0; i--) {
        const current = base[i];
        if (current === "0") {
          base = base.slice(0, i) + "1" + base.slice(i + 1);
          updated = true;
          break;
        }
      }

      if (!updated) {
        base = "1".padEnd(base.length + 1, "0");
      }

      startFrom++;

      return { base, num: startFrom };
    },
  });
};
