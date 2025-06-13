type ConvertObjectToMapArgs = {
  obj: Record<string, unknown>;
};

export const convertObjectToMap = ({ obj }: ConvertObjectToMapArgs) => {
  if (typeof obj !== "object") {
    return obj;
  }

  return recursivelyConvertObjectToMap({ obj });
};

type RecursivelyConvertObjectToMapArgs = {
  obj: unknown;
};

const recursivelyConvertObjectToMap = ({ obj }: RecursivelyConvertObjectToMapArgs): any => {
  if (Array.isArray(obj)) {
    return obj.map((cell) => recursivelyConvertObjectToMap({ obj: cell }));
  } else if (obj && typeof obj === "object" && !(obj instanceof Map)) {
    return new Map(
      Object.entries(obj).map(([key, value]) => [
        key,
        recursivelyConvertObjectToMap({ obj: value }),
      ]),
    );
  }

  return obj;
};
