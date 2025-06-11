type PadNumberStartArgs = {
  num: number;
  amountOfPaddings: number;
  padString: string;
};

export const padNumberStart = ({ num, amountOfPaddings, padString }: PadNumberStartArgs) => {
  return num.toString().padStart(amountOfPaddings, padString).split("").map(Number);
};

type PadNumberStringStartArgs = {
  numString: string;
  amountOfPaddings: number;
  padString: string;
};

export const padNumberStringStart = ({
  numString,
  amountOfPaddings,
  padString,
}: PadNumberStringStartArgs) => {
  return numString.padStart(amountOfPaddings, padString).split("").map(Number);
};
