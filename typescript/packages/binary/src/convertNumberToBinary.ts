type ConvertNumberToBinaryArgs = {
  num: number;
};

// TODO: Replace the 2 with a variable and move to another package that would let converting to other different bases.

export const convertNumberToBinary = ({ num }: ConvertNumberToBinaryArgs) => {
  if (num === 0) {
    return "0";
  }

  let result = "";
  while (num > 0) {
    result = (num % 2) + result;
    num = Math.floor(num / 2);
  }

  return result;
};
