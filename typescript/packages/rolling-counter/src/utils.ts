import { countDigits, padNumberStringStart } from "@packages/number-utils";

type FormatNumberArgs = {
  from: number;
  to: number;
};

export const formatNumbers = ({ from, to }: FormatNumberArgs) => {
  const fromCount = countDigits({ num: from });
  const toCount = countDigits({ num: to });
  const largestAmount = Math.max(fromCount.integerDigits, toCount.integerDigits);

  return padNumberStringStart({
    numString: fromCount.numString,
    amountOfPaddings: largestAmount,
    padString: "0",
  });
};
