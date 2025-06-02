import { measureTimeValue } from "@packages/high-precision-timing";

type ExpectArgs = {
  callback: Function;
};

type ToRunFasterThanArgs = {
  timeInMS: number;
};

export const expectCallback = ({ callback }: ExpectArgs) => {
  return {
    toRunFasterThan({ timeInMS }: ToRunFasterThanArgs) {
      const duration = measureTimeValue({ callback: () => callback() });
      if (duration > timeInMS) {
        throw new Error(`Expected callback to run faster than ${timeInMS} milliseconds.`);
      }
    },
  };
};
