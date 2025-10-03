type FuzzyMatchArgs = {
  str: string;
  input: string;
};

export const fuzzyMatch = ({ str, input }: FuzzyMatchArgs) => {
  let index = 0;

  for (let i = 0; i < str.length; i++) {
    const current = str[i];
    if (current === input[index]) {
      index++;
    }

    if (index === input.length) {
      return true;
    }
  }

  return false;
};
