type IsAlphaNumericArgs = {
  str: string;
};

export const isAlphaNumeric = ({ str }: IsAlphaNumericArgs) => {
  return /^[a-zA-Z0-9]+$/.test(str);
};
