type ExpectArgs = {
  value: any;
};

type ToBeArgs = {
  expected: any;
};

type ToEqualArgs = {
  expected: any;
};

type ToBeBetweenArgs = {
  from: number;
  to: number;
};

export const expect = ({ value }: ExpectArgs) => {
  return {
    toBe({ expected }: ToBeArgs) {
      if (value !== expected) {
        throw new Error(`Expected ${value} to be ${expected}`);
      }
    },
    toEqual({ expected }: ToEqualArgs) {
      const a = JSON.stringify(value);
      const b = JSON.stringify(expected);
      if (a !== b) {
        throw new Error(`Expected ${a} to equal ${b}`);
      }
    },
    toBeBetween({ from, to }: ToBeBetweenArgs) {
      if (typeof value !== "number") {
        throw new Error(`Expected ${value} to be numeric`);
      }

      if (from > value || to < value) {
        throw new Error(`Expected ${value} to be between ${from} and ${value}`);
      }
    },
    toNotBeBetween({ from, to }: ToBeBetweenArgs) {
      if (typeof value !== "number") {
        throw new Error(`Expected ${value} to be numeric`);
      }

      if (from < value && to > value) {
        throw new Error(`Expected ${value} to not be between ${from} and ${value}`);
      }
    },
  };
};
