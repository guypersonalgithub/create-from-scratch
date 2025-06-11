type PickValuesArgs<T extends Record<string, unknown>, K extends keyof T> = {
  obj: T;
  keys: K[];
};

export const pickValues = <T extends Record<string, unknown>, K extends keyof T>({
  obj,
  keys,
}: PickValuesArgs<T, K>): Partial<Pick<T, K>> => {
  const result = {} as Partial<Pick<T, K>>;
  for (const key of keys) {
    result[key] = obj[key];
  }
  return result;
};
