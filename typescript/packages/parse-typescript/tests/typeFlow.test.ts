import { expect, test } from "vitest";
import { parseTypescript } from "../src";

test("Basic type definition flow", () => {
  expect(
    parseTypescript({
      input: "type Test = string;",
    }),
  ).toStrictEqual([
    {
      type: "type-definition",
      value: "type",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "type",
      value: "Test",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "equal",
      value: "=",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "type",
      value: "string",
    },
    {
      type: "end-of-line",
      value: ";",
    },
  ]);
});

test("Basic type definition flow with and/or additions", () => {
  expect(
    parseTypescript({
      input: "type Test = string | number | any & {};",
    }),
  ).toStrictEqual([
    {
      type: "type-definition",
      value: "type",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "type",
      value: "Test",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "equal",
      value: "=",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "type",
      value: "string",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "type-and",
      value: "|",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "type",
      value: "number",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "type-and",
      value: "|",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "type",
      value: "any",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "type-or",
      value: "&",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "object-curly-type-bracket",
      value: "{",
    },
    {
      type: "object-curly-type-bracket",
      value: "}",
    },
    {
      type: "end-of-line",
      value: ";",
    },
  ]);
});

test("Basic type definition flow with object value", () => {
  expect(
    parseTypescript({
      input: `type Test = {
    prop1: string;
    prop2: number;
    prop3?: any;
    prop4: {
      prop5: Test;
    };
};`,
    }),
  ).toStrictEqual([
    {
      type: "type-definition",
      value: "type",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "type",
      value: "Test",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "equal",
      value: "=",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "object-curly-type-bracket",
      value: "{",
    },
    {
      type: "whitespace",
      value: "\n    ",
    },
    {
      type: "object-property",
      value: "prop1",
    },
    {
      type: "object-colon",
      value: ":",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "type",
      value: "string",
    },
    {
      type: "end-of-line",
      value: ";",
    },
    {
      type: "whitespace",
      value: "\n    ",
    },
    {
      type: "object-property",
      value: "prop2",
    },
    {
      type: "object-colon",
      value: ":",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "type",
      value: "number",
    },
    {
      type: "end-of-line",
      value: ";",
    },
    {
      type: "whitespace",
      value: "\n    ",
    },
    {
      type: "object-property",
      value: "prop3",
    },
    {
      type: "optional-argument",
      value: "?",
    },
    {
      type: "object-colon",
      value: ":",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "type",
      value: "any",
    },
    {
      type: "end-of-line",
      value: ";",
    },
    {
      type: "whitespace",
      value: "\n    ",
    },
    {
      type: "object-property",
      value: "prop4",
    },
    {
      type: "object-colon",
      value: ":",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "object-curly-type-bracket",
      value: "{",
    },
    {
      type: "whitespace",
      value: "\n      ",
    },
    {
      type: "object-property",
      value: "prop5",
    },
    {
      type: "object-colon",
      value: ":",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "type",
      value: "Test",
    },
    {
      type: "end-of-line",
      value: ";",
    },
    {
      type: "whitespace",
      value: "\n    ",
    },
    {
      type: "object-curly-type-bracket",
      value: "}",
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
      type: "object-curly-type-bracket",
      value: "}",
    },
    {
      type: "end-of-line",
      value: ";",
    },
  ]);
});

test("Basic type definition flow with string value", () => {
  expect(
    parseTypescript({
      input: `type Test = "string";`,
    }),
  ).toStrictEqual([
    {
      type: "type-definition",
      value: "type",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "type",
      value: "Test",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "equal",
      value: "=",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "string-type",
      value: '"string"',
    },
    {
      type: "end-of-line",
      value: ";",
    },
  ]);
});

test("Basic type definition flow with template literal value", () => {
  const templateLiteral = "`${123} testing`";

  expect(
    parseTypescript({
      input: `type Test = ${templateLiteral};`,
    }),
  ).toStrictEqual([
    {
      type: "type-definition",
      value: "type",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "type",
      value: "Test",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "equal",
      value: "=",
    },
    {
      type: "whitespace",
      value: " ",
    },
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
      type: "type",
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

test("Basic type definition flow with keyof value", () => {
  expect(parseTypescript({ input: "type Test = keyof string;" })).toStrictEqual([
    {
      type: "type-definition",
      value: "type",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "type",
      value: "Test",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "equal",
      value: "=",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "keyof",
      value: "keyof",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "type",
      value: "string",
    },
    {
      type: "end-of-line",
      value: ";",
    },
  ]);
});

test("Basic type definition flow with keyof typeof value", () => {
  expect(parseTypescript({ input: "type Test = keyof typeof test;" })).toStrictEqual([
    {
      type: "type-definition",
      value: "type",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "type",
      value: "Test",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "equal",
      value: "=",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "keyof",
      value: "keyof",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "keyof",
      value: "typeof",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "variable",
      value: "test",
    },
    {
      type: "end-of-line",
      value: ";",
    },
  ]);
});
