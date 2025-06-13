type AreSetsEqualArgs<T> = {
  setA: Set<T>;
  setB: Set<T>;
};

export const areSetsEqual = <T>({ setA, setB }: AreSetsEqualArgs<T>) => {
  if (setA.size !== setB.size) {
    return false;
  }

  for (const item of setA) {
    if (!setB.has(item)) {
      return false;
    }
  }

  return true;
};
