type AreObjectsDeepEqualCyclesArgs = {
  obj1: unknown;
  obj2: unknown;
  seen?: WeakMap<object, unknown>;
};

export const areObjectsDeepEqualCycles = ({
  obj1,
  obj2,
  seen = new WeakMap(),
}: AreObjectsDeepEqualCyclesArgs) => {
  if (Object.is(obj1, obj2)) {
    return true;
  }

  if (typeof obj1 !== "object" || typeof obj2 !== "object" || !obj1 || !obj2) {
    return false;
  }

  if (seen.get(obj1) === obj2) {
    return true;
  }
  seen.set(obj1, obj2);

  if (obj1.constructor !== obj2.constructor) {
    return false;
  }

  if (obj1 instanceof Set) {
    if (!(obj2 instanceof Set)) {
      return false;
    }

    if (obj1.size !== obj2.size) {
      return false;
    }
    for (const v of obj1) {
      if (![...obj2].some((x) => areObjectsDeepEqualCycles({ obj1: v, obj2: x, seen }))) {
        return false;
      }
    }
    return true;
  }

  if (obj1 instanceof Map) {
    if (!(obj2 instanceof Map)) {
      return false;
    }

    if (obj1.size !== obj2.size) {
      return false;
    }
    for (const [k, v] of obj1) {
      if (!obj2.has(k) || !areObjectsDeepEqualCycles({ obj1: v, obj2: obj2.get(k), seen })) {
        return false;
      }
    }
    return true;
  }

  const keys = Reflect.ownKeys(obj1);
  if (keys.length !== Reflect.ownKeys(obj2).length) {
    return false;
  }

  for (const key of keys) {
    if (
      !areObjectsDeepEqualCycles({
        obj1: obj1[key as keyof typeof obj1],
        obj2: obj2[key as keyof typeof obj2],
        seen,
      })
    ) {
      return false;
    }
  }

  return true;
};
