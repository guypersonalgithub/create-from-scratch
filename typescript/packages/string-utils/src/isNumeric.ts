type IsNumericArgs = {
  str: string;
};

export const isNumeric = ({ str }: IsNumericArgs) => {
  return !isNaN(Number(str)) && str.trim() !== "";
};
