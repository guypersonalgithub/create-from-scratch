type AreArraysEqualArgs = {
  array1: string[];
  array2: string[];
};

export const areArraysEqual = ({ array1, array2 }: AreArraysEqualArgs) => {
  if (array1.length !== array2.length) {
    return false;
  }

  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }

  return true;
};
