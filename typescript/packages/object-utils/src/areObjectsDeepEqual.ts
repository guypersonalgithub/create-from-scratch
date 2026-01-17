type AreObjectsDeepEqualArgs = {
  obj1: unknown;
  obj2: unknown;
};

export const areObjectsDeepEqual = ({ obj1, obj2 }: AreObjectsDeepEqualArgs) => {
  if (Object.is(obj1, obj2)) {
    return true;
  }

  if (typeof obj1 !== "object" || typeof obj2 !== "object" || !obj1 || !obj2) {
    return false;
  }

  if (obj1 instanceof Date && obj2 instanceof Date) {
    return obj1.getTime() === obj2.getTime();
  }

  if (obj1 instanceof RegExp && obj2 instanceof RegExp) {
    return obj1.toString() === obj2.toString();
  }

  if (obj1 instanceof Set && obj2 instanceof Set) {
    if (obj1.size !== obj2.size) {
      return false;
    }

    for (const val of obj1) {
      if (![...obj2].some((v) => areObjectsDeepEqual({ obj1: val, obj2: v }))) {
        return false;
      }
    }

    return true;
  }

  if (obj1 instanceof Map && obj2 instanceof Map) {
    if (obj1.size !== obj2.size) {
      return false;
    }

    for (const [key, val] of obj1) {
      if (!obj2.has(key) || !areObjectsDeepEqual({ obj1: val, obj2: obj2.get(key) })) {
        return false;
      }
    }
    return true;
  }

  // Array or Object
  const keysA = Object.keys(obj1);
  const keysB = Object.keys(obj2);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (const key of keysA) {
    if (!keysB.includes(key)) {
      return false;
    }
    if (
      !areObjectsDeepEqual({
        obj1: obj1[key as keyof typeof obj1],
        obj2: obj2[key as keyof typeof obj2],
      })
    ) {
      return false;
    }
  }

  return true;
};
