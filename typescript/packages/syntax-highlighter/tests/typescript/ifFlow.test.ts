import { expect, test } from "vitest";
import { parseTypescript } from "../../src";

test("Basic if flow", () => {
  expect(
    parseTypescript({
      input: `if (test) {
  return "test";
}`,
    }),
  ).toStrictEqual([
    {
      type: "if",
      value: "if",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "parenthesis",
      value: "(",
    },
    {
      type: "variable",
      value: "test",
    },
    {
      type: "parenthesis",
      value: ")",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "if-curly-bracket",
      value: "{",
    },
    {
      type: "whitespace",
      value: "\n  ",
    },
    {
      type: "return",
      value: "return",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "string",
      value: '"test"',
    },
    {
      type: "end-of-line",
      value: ";",
    },
    {
      type: "whitespace",
      value: "\n",
    },
    {
      type: "if-curly-bracket",
      value: "}",
    },
  ]);
});
