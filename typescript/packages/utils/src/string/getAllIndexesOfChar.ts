type GetAllIndexesOfCharArgs = {
  str: string;
  char: string;
};

export const getAllIndexesOfChar = ({ str, char }: GetAllIndexesOfCharArgs) => {
  const indexes: number[] = [];

  for (let i = 0; i < str.length; i++) {
    if (str[i] === char) {
      indexes.push(i);
    }
  }

  return indexes;
};
