import { test, expect, expectCallback } from "../src";
import { delay } from "@packages/dev-utils";

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
        expect({ value: error.message }).toBe({ expected: `Expected 1 to be ` });
      }
    }
  },
});

test({
  name: "Passing expect callback test",
  fn: () => expectCallback({ callback: () => {} }).toRunFasterThan({ timeInMS: 10000 }),
});

test({
  name: "Failing expect callback test",
  fn: () => {
    try {
      expectCallback({ callback: () => delay({ ms: 2000 }) }).toRunFasterThan({ timeInMS: 1000 });
    } catch (error) {
      const isError = error instanceof Error;
      if (isError) {
        expect({ value: error.message }).toBe({
          expected: `Expected callback to run faster than 1000 milliseconds.`,
        });
      }
    }
  },
});
