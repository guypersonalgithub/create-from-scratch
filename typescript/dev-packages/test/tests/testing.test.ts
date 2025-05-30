import { test, expect } from "../src";

test({
  name: "Passing test",
  fn: () => expect({ value: 1 }).toBe({ expected: 3 - 2 }),
});
test({
  name: "Failing test",
  fn: () => {
    try {
      expect({ value: 1 }).toBe({ expected: "" });
    } catch (error) {
      const isError = error instanceof Error;
      if (isError) {
        expect({ value: error.message }).toBe({ expected: `Expected ${1} to be ${""}` });
      }
    }
  },
});
