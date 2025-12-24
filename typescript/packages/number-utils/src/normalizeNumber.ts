type NormalizeNumberArgs = {
  num: number;
  digits: number;
};

export const normalizeNumber = ({ num, digits }: NormalizeNumberArgs) => {
  const factor = Math.pow(10, digits);

  return Math.round(num * factor) / factor;
};
