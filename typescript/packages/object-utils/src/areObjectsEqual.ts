type AreObjectsEqualArgs = {
  obj1: unknown;
  obj2: unknown;
};

export const areObjectsEqual = ({ obj1, obj2 }: AreObjectsEqualArgs) => {
  // Check if both values are strictly equal
  if (obj1 === obj2) {
    return true;
  }

  // Check if both values are objects and not null
  if (typeof obj1 !== "object" || typeof obj2 !== "object" || obj1 === null || obj2 === null) {
    return false;
  }

  // Get keys of both objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check if number of keys is different
  if (keys1.length !== keys2.length) {
    return false;
  }

  // Check if values for each key are equal
  for (const key of keys1) {
    if (
      !keys2.includes(key) ||
      !areObjectsEqual({
        obj1: (obj1 as Record<string, unknown>)[key],
        obj2: (obj2 as Record<string, unknown>)[key],
      })
    ) {
      return false;
    }
  }

  return true;
};
