type PadNumberEndArgs = {
  num: number;
  amountOfPaddings: number;
  padString: string;
};

export const padNumberEnd = ({ num, amountOfPaddings, padString }: PadNumberEndArgs) => {
  return num.toString().padEnd(amountOfPaddings, padString).split("").map(Number);
};

type PadNumberStringEndArgs = {
  numString: string;
  amountOfPaddings: number;
  padString: string;
};

export const padNumberStringEnd = ({
  numString,
  amountOfPaddings,
  padString,
}: PadNumberStringEndArgs) => {
  return numString.padEnd(amountOfPaddings, padString).split("").map(Number);
};
