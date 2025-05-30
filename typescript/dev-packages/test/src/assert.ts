type ExpectArgs = {
  value: any;
};

type ToBeArgs = {
  expected: any;
};

type ToEqualArgs = {
  expected: any;
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
        throw new Error(`Expected ${value} to equal ${expected}`);
      }
    },
  };
};
