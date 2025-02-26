type AreStringArraysEqualArgs = {
  array1: string[];
  array2: string[];
};

export const areStringArraysEqual = ({ array1, array2 }: AreStringArraysEqualArgs) => {
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
