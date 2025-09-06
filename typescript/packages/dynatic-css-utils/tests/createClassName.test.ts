import { test, expect } from "@packages/test";
import { createClassName } from "../src/createClassName";

const value = "test";
const pseudoClass = ":hover";
const mediaQuery = "@media ()";

test({
  name: "Basic value",
  fn: () => expect({ value: createClassName({ value }) }).toBe({ expected: value }),
});

test({
  name: "Value + pseudoClass",
  fn: () =>
    expect({ value: createClassName({ value, pseudoClass }) }).toBe({
      expected: `${value}${pseudoClass}`,
    }),
});

test({
  name: "Value + mediaQuery",
  fn: () =>
    expect({ value: createClassName({ value, mediaQuery }) }).toBe({
      expected: `${mediaQuery}-${value}`,
    }),
});

test({
  name: "Value + pseudoClass + mediaQuery",
  fn: () =>
    expect({ value: createClassName({ value, pseudoClass, mediaQuery }) }).toBe({
      expected: `${mediaQuery}-${value}${pseudoClass}`,
    }),
});
