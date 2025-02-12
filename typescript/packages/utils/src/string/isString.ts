type IsStringOnlyWithLettersArgs = {
  str: string;
};

export const isStringOnlyWithLetters = ({ str }: IsStringOnlyWithLettersArgs) => {
  return /^[A-Za-z]+$/.test(str);
};
