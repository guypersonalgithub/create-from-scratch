import { expect, test } from "vitest";
import { parseTypescript } from "../../src";

test("Basic variable with properties", () => {
  expect(parseTypescript({ input: "test.testing.test2;" })).toStrictEqual([
    {
      type: "variable",
      value: "test",
    },
    {
      type: "operator",
      value: ".",
    },
    {
      type: "variable",
      value: "testing",
    },
    {
      type: "operator",
      value: ".",
    },
    {
      type: "variable",
      value: "test2",
    },
    {
      type: "end-of-line",
      value: ";",
    },
  ]);
});

test("Basic variable with properties and function calls", () => {
  expect(parseTypescript({ input: "test.testing.test2.test3().test.test5().test;" })).toStrictEqual(
    [
      {
        type: "variable",
        value: "test",
      },
      {
        type: "operator",
        value: ".",
      },
      {
        type: "variable",
        value: "testing",
      },
      {
        type: "operator",
        value: ".",
      },
      {
        type: "variable",
        value: "test2",
      },
      {
        type: "operator",
        value: ".",
      },
      {
        type: "invoked-function",
        value: "test3",
      },
      {
        type: "parenthesis",
        value: "(",
      },
      {
        type: "parenthesis",
        value: ")",
      },
      {
        type: "operator",
        value: ".",
      },
      {
        type: "variable",
        value: "test",
      },
      {
        type: "operator",
        value: ".",
      },
      {
        type: "invoked-function",
        value: "test5",
      },
      {
        type: "parenthesis",
        value: "(",
      },
      {
        type: "parenthesis",
        value: ")",
      },
      {
        type: "operator",
        value: ".",
      },
      {
        type: "variable",
        value: "test",
      },
      {
        type: "end-of-line",
        value: ";",
      },
    ],
  );
});
