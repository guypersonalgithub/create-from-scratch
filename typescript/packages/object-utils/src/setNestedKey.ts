// TODO: consider deleting as its no longer needed.

type SetNestedKeyArgs = {
  obj: Record<string, unknown>;
  keys: string[];
  valueKey?: string;
  value?: string;
};

export const setNestedKey = ({ obj, keys, valueKey, value }: SetNestedKeyArgs) => {
  let current: Record<string, unknown> = obj;

  const iterationKeys =
    valueKey && keys[keys.length - 1] === valueKey ? keys.slice(0, keys.length - 1) : keys;

  iterationKeys.forEach((key) => {
    if (!current[key]) {
      current[key] = {};
    } else if (typeof current[key] !== "object") {
      throw new Error(`Encountered a non-object key ${key} that was requested to nest into.`);
    }

    current = current[key] as Record<string, unknown>;
  });

  if (valueKey && value) {
    current[valueKey] = value;
  }

  return obj;
};
