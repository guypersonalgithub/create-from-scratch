import { areObjectsEqual } from "../object";

type AreArraysEqualArgs = {
  array1: unknown[];
  array2: unknown[];
};

export const areArraysEqual = ({ array1, array2 }: AreArraysEqualArgs) => {
  if (array1.length !== array2.length) {
    return false;
  }

  for (let i = 0; i < array1.length; i++) {
    const areEqual = areObjectsEqual({
      obj1: array1[i],
      obj2: array2[i],
    });
    if (!areEqual) {
      return false;
    }
  }

  return true;
};
