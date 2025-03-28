import { expect, test } from "vitest";
import { parseTypescript } from "../../src";

test("Define variable flow with string value", () => {
  expect(
    parseTypescript({
      input: 'const testing = "value";',
    }),
  ).toStrictEqual([
    {
      type: "definition",
      value: "const",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "variable",
      value: "testing",
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
      value: '"value"',
    },
    {
      type: "end-of-line",
      value: ";",
    },
  ]);
});

test("Define variable flow with numeric value", () => {
  expect(parseTypescript({ input: "const testing = 2.5;" })).toStrictEqual([
    {
      type: "definition",
      value: "const",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "variable",
      value: "testing",
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
      type: "number",
      value: "2.5",
    },
    {
      type: "end-of-line",
      value: ";",
    },
  ]);
});

test("Define variable flow with boolean value", () => {
  expect(parseTypescript({ input: "const testing = true;" })).toStrictEqual([
    {
      type: "definition",
      value: "const",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "variable",
      value: "testing",
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
      type: "boolean",
      value: "true",
    },
    {
      type: "end-of-line",
      value: ";",
    },
  ]);
});

test("Define variable flow with null value", () => {
  expect(parseTypescript({ input: "const testing = null;" })).toStrictEqual([
    {
      type: "definition",
      value: "const",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "variable",
      value: "testing",
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
      type: "null",
      value: "null",
    },
    {
      type: "end-of-line",
      value: ";",
    },
  ]);
});

test("Define variable flow with undefined value", () => {
  expect(parseTypescript({ input: "const testing = undefined;" })).toStrictEqual([
    {
      type: "definition",
      value: "const",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "variable",
      value: "testing",
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
      type: "undefined",
      value: "undefined",
    },
    {
      type: "end-of-line",
      value: ";",
    },
  ]);
});

test("Define variable flow with object value", () => {
  expect(
    parseTypescript({ input: 'const testing = { test: "test", testing: { test: { test2 }}};' }),
  ).toStrictEqual([
    {
      type: "definition",
      value: "const",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "variable",
      value: "testing",
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
      type: "object-curly-bracket",
      value: "{",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "object-property",
      value: "test",
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
      type: "string",
      value: '"test"',
    },
    {
      type: "comma",
      value: ",",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "object-property",
      value: "testing",
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
      type: "object-curly-bracket",
      value: "{",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "object-property",
      value: "test",
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
      type: "object-curly-bracket",
      value: "{",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "object-property",
      value: "test2",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "object-curly-bracket",
      value: "}",
    },
    {
      type: "object-curly-bracket",
      value: "}",
    },
    {
      type: "object-curly-bracket",
      value: "}",
    },
    {
      type: "end-of-line",
      value: ";",
    },
  ]);
});

test("Define variable flow with object value and property value type casting", () => {
  expect(
    parseTypescript({
      input: 'const testing = { test: "test" as any, testing: { test: { test2 }}};',
    }),
  ).toStrictEqual([
    {
      type: "definition",
      value: "const",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "variable",
      value: "testing",
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
      type: "object-curly-bracket",
      value: "{",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "object-property",
      value: "test",
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
      type: "string",
      value: '"test"',
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "as",
      value: "as",
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
      type: "comma",
      value: ",",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "object-property",
      value: "testing",
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
      type: "object-curly-bracket",
      value: "{",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "object-property",
      value: "test",
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
      type: "object-curly-bracket",
      value: "{",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "object-property",
      value: "test2",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "object-curly-bracket",
      value: "}",
    },
    {
      type: "object-curly-bracket",
      value: "}",
    },
    {
      type: "object-curly-bracket",
      value: "}",
    },
    {
      type: "end-of-line",
      value: ";",
    },
  ]);
});

test("Define variable flow with type", () => {
  expect(parseTypescript({ input: 'const testing: string = "test";' })).toStrictEqual([
    {
      type: "definition",
      value: "const",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "variable",
      value: "testing",
    },
    {
      type: "type-colon",
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
      value: '"test"',
    },
    {
      type: "end-of-line",
      value: ";",
    },
  ]);
});

test("Define variable flow with type and type casting", () => {
  expect(parseTypescript({ input: 'const testing: string = "test" as any;' })).toStrictEqual([
    {
      type: "definition",
      value: "const",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "variable",
      value: "testing",
    },
    {
      type: "type-colon",
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
      value: '"test"',
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "as",
      value: "as",
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
  ]);
});

test("Define variable flow with function call value", () => {
  expect(parseTypescript({ input: 'const testing = test("hello");' })).toStrictEqual([
    {
      type: "definition",
      value: "const",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "variable",
      value: "testing",
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
      type: "invoked-function",
      value: "test",
    },
    {
      type: "parenthesis",
      value: "(",
    },
    {
      type: "string",
      value: '"hello"',
    },
    {
      type: "parenthesis",
      value: ")",
    },
    {
      type: "end-of-line",
      value: ";",
    },
  ]);
});

test("Define variable flow with arrow function value", () => {
  expect(parseTypescript({ input: "const test = () => {}" })).toStrictEqual([
    {
      type: "definition",
      value: "const",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "function-name",
      value: "test",
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
      type: "parenthesis",
      value: "(",
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
      type: "arrow",
      value: "=>",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "function-curly-bracket",
      value: "{",
    },
    {
      type: "function-curly-bracket",
      value: "}",
    },
  ]);
});

test("Define variable flow with arrow function value, props and return type", () => {
  expect(
    parseTypescript({ input: "const test = (props: string, props2: number): void => {}" }),
  ).toStrictEqual([
    {
      type: "definition",
      value: "const",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "function-name",
      value: "test",
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
      type: "parenthesis",
      value: "(",
    },
    {
      type: "variable",
      value: "props",
    },
    {
      type: "type-colon",
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
      type: "comma",
      value: ",",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "variable",
      value: "props2",
    },
    {
      type: "type-colon",
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
      type: "parenthesis",
      value: ")",
    },
    {
      type: "type-colon",
      value: ":",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "type",
      value: "void",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "arrow",
      value: "=>",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "function-curly-bracket",
      value: "{",
    },
    {
      type: "function-curly-bracket",
      value: "}",
    },
  ]);
});

test("Define variable flow with arrow function value, props, return type and generic type", () => {
  expect(
    parseTypescript({ input: "const test = <T>(props: string, props2: number): void => {}" }),
  ).toStrictEqual([
    {
      type: "definition",
      value: "const",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "function-name",
      value: "test",
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
      type: "angle",
      value: "<",
    },
    {
      type: "type",
      value: "T",
    },
    {
      type: "angle",
      value: ">",
    },
    {
      type: "parenthesis",
      value: "(",
    },
    {
      type: "variable",
      value: "props",
    },
    {
      type: "type-colon",
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
      type: "comma",
      value: ",",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "variable",
      value: "props2",
    },
    {
      type: "type-colon",
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
      type: "parenthesis",
      value: ")",
    },
    {
      type: "type-colon",
      value: ":",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "type",
      value: "void",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "arrow",
      value: "=>",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "function-curly-bracket",
      value: "{",
    },
    {
      type: "function-curly-bracket",
      value: "}",
    },
  ]);
});

test("Define variable flow with arrow function value, props, return type and multiple generic types", () => {
  expect(
    parseTypescript({
      input: `const example = <T, S>(arg: T, arg2: S) => {
  return { arg, arg2 };
};
const res = example("test", 1);`,
    }),
  ).toStrictEqual([
    {
      type: "definition",
      value: "const",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "function-name",
      value: "example",
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
      type: "angle",
      value: "<",
    },
    {
      type: "type",
      value: "T",
    },
    {
      type: "comma",
      value: ",",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "type",
      value: "S",
    },
    {
      type: "angle",
      value: ">",
    },
    {
      type: "parenthesis",
      value: "(",
    },
    {
      type: "variable",
      value: "arg",
    },
    {
      type: "type-colon",
      value: ":",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "type",
      value: "T",
    },
    {
      type: "comma",
      value: ",",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "variable",
      value: "arg2",
    },
    {
      type: "type-colon",
      value: ":",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "type",
      value: "S",
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
      type: "arrow",
      value: "=>",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "function-curly-bracket",
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
      type: "object-curly-bracket",
      value: "{",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "object-property",
      value: "arg",
    },
    {
      type: "comma",
      value: ",",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "object-property",
      value: "arg2",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "object-curly-bracket",
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
      type: "function-curly-bracket",
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
      type: "definition",
      value: "const",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "variable",
      value: "res",
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
      type: "invoked-function",
      value: "example",
    },
    {
      type: "parenthesis",
      value: "(",
    },
    {
      type: "string",
      value: '"test"',
    },
    {
      type: "comma",
      value: ",",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "number",
      value: "1",
    },
    {
      type: "parenthesis",
      value: ")",
    },
    {
      type: "end-of-line",
      value: ";",
    },
  ]);
});

test("Define variable flow with arrow function value, props, return type, generic type and a function body", () => {
  expect(
    parseTypescript({
      input: `const test = <T>(props: string, props2: number): void => {
    const test = props + props2;
    return test;
}`,
    }),
  ).toStrictEqual([
    {
      type: "definition",
      value: "const",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "function-name",
      value: "test",
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
      type: "angle",
      value: "<",
    },
    {
      type: "type",
      value: "T",
    },
    {
      type: "angle",
      value: ">",
    },
    {
      type: "parenthesis",
      value: "(",
    },
    {
      type: "variable",
      value: "props",
    },
    {
      type: "type-colon",
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
      type: "comma",
      value: ",",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "variable",
      value: "props2",
    },
    {
      type: "type-colon",
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
      type: "parenthesis",
      value: ")",
    },
    {
      type: "type-colon",
      value: ":",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "type",
      value: "void",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "arrow",
      value: "=>",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "function-curly-bracket",
      value: "{",
    },
    {
      type: "whitespace",
      value: "\n    ",
    },
    {
      type: "definition",
      value: "const",
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
      type: "variable",
      value: "props",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "arithmetic-operator",
      value: "+",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "variable",
      value: "props2",
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
      type: "return",
      value: "return",
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
    {
      type: "whitespace",
      value: "\n",
    },
    {
      type: "function-curly-bracket",
      value: "}",
    },
  ]);
});

test("Define variable flow with array value", () => {
  expect(
    parseTypescript({
      input: `const testing = ["test" as string,,,,,,,,,,, , , true, false, test, "test2", 'test3'];`,
    }),
  ).toStrictEqual([
    {
      type: "definition",
      value: "const",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "variable",
      value: "testing",
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
      type: "array-square-bracket",
      value: "[",
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
      type: "as",
      value: "as",
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
      type: "comma",
      value: ",",
    },
    {
      type: "comma",
      value: ",",
    },
    {
      type: "comma",
      value: ",",
    },
    {
      type: "comma",
      value: ",",
    },
    {
      type: "comma",
      value: ",",
    },
    {
      type: "comma",
      value: ",",
    },
    {
      type: "comma",
      value: ",",
    },
    {
      type: "comma",
      value: ",",
    },
    {
      type: "comma",
      value: ",",
    },
    {
      type: "comma",
      value: ",",
    },
    {
      type: "comma",
      value: ",",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "comma",
      value: ",",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "comma",
      value: ",",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "boolean",
      value: "true",
    },
    {
      type: "comma",
      value: ",",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "boolean",
      value: "false",
    },
    {
      type: "comma",
      value: ",",
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
      type: "comma",
      value: ",",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "string",
      value: '"test2"',
    },
    {
      type: "comma",
      value: ",",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "string",
      value: "'test3'",
    },
    {
      type: "array-square-bracket",
      value: "]",
    },
    {
      type: "end-of-line",
      value: ";",
    },
  ]);
});

test("Define variable flow with class initialization", () => {
  expect(parseTypescript({ input: "const test = new Test();" })).toStrictEqual([
    {
      type: "definition",
      value: "const",
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
      type: "new",
      value: "new",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "class-name",
      value: "Test",
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
      type: "end-of-line",
      value: ";",
    },
  ]);
});
