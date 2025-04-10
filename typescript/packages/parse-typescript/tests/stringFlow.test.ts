import { expect, test } from "vitest";
import { parseTypescript } from "../src";

test("Basic string flow", () => {
  expect(
    parseTypescript({
      input: '"Testing 123";',
    }),
  ).toStrictEqual([
    {
      type: "string",
      value: '"Testing 123"',
    },
    {
      type: "end-of-line",
      value: ";",
    },
  ]);
});

test("Basic template literal flow", () => {
  const templateLiteral = "`${123} testing`";

  expect(
    parseTypescript({
      input: `${templateLiteral};`,
    }),
  ).toStrictEqual([
    {
      type: "string",
      value: "`",
    },
    {
      type: "template-literal-expression-interpolation",
      value: "$",
    },
    {
      type: "template-literal-expression-interpolation",
      value: "{",
    },
    {
      type: "number",
      value: "123",
    },
    {
      type: "template-literal-expression-interpolation",
      value: "}",
    },
    {
      type: "string",
      value: " testing`",
    },
    {
      type: "end-of-line",
      value: ";",
    },
  ]);
});
