import { expect, test } from "vitest";
import { parseTypescript } from "../src";

test("Basic JSX flow", () => {
  expect(
    parseTypescript({ input: '<Test test="test" test2="test2" test3={test3} test4 test5 />' }),
  ).toStrictEqual([
    {
      type: "angle",
      value: "<",
    },
    {
      type: "jsx",
      value: "Test",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "jsx-property",
      value: "test",
    },
    {
      type: "equal",
      value: "=",
    },
    {
      type: "string",
      value: '"test"',
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "jsx-property",
      value: "test2",
    },
    {
      type: "equal",
      value: "=",
    },
    {
      type: "string",
      value: '"test2"',
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "jsx-property",
      value: "test3",
    },
    {
      type: "equal",
      value: "=",
    },
    {
      type: "jsx-property-expression-interpolation",
      value: "{",
    },
    {
      type: "variable",
      value: "test3",
    },
    {
      type: "jsx-property-expression-interpolation",
      value: "}",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "jsx-property",
      value: "test4",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "jsx-property",
      value: "test5",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "operator",
      value: "/",
    },
    {
      type: "angle",
      value: ">",
    },
  ]);
});
