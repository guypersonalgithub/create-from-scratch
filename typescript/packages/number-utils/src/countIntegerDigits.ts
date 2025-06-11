type CountIntegerDigitsArgs = {
  num: number;
};

export const countIntegerDigits = ({ num }: CountIntegerDigitsArgs) => {
  return Math.abs(Math.trunc(num)).toString().length;
};
