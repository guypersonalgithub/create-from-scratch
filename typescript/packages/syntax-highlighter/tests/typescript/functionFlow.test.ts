import { expect, test } from "vitest";
import { parseTypescript } from "../../src";

test("Function flow", () => {
  expect(parseTypescript({ input: "function test() {};" })).toStrictEqual([
    {
      type: "function",
      value: "function",
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
      type: "function-curly-bracket",
      value: "{",
    },
    {
      type: "function-curly-bracket",
      value: "}",
    },
    {
      type: "end-of-line",
      value: ";",
    },
  ]);
});

test("Function flow with props and return type", () => {
  expect(parseTypescript({ input: "function test(prop: string): void {};" })).toStrictEqual([
    {
      type: "function",
      value: "function",
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
      type: "parenthesis",
      value: "(",
    },
    {
      type: "variable",
      value: "prop",
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
      type: "function-curly-bracket",
      value: "{",
    },
    {
      type: "function-curly-bracket",
      value: "}",
    },
    {
      type: "end-of-line",
      value: ";",
    },
  ]);
});

test("Function flow with props, return type and generic type", () => {
  expect(
    parseTypescript({ input: "function test<T>(prop: string, prop2: T): void {};" }),
  ).toStrictEqual([
    {
      type: "function",
      value: "function",
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
      value: "prop",
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
      value: "prop2",
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
      type: "function-curly-bracket",
      value: "{",
    },
    {
      type: "function-curly-bracket",
      value: "}",
    },
    {
      type: "end-of-line",
      value: ";",
    },
  ]);
});

test("Function flow with props, return type, generic type and function body", () => {
  expect(
    parseTypescript({
      input: `function test<T>(prop: string, prop2: T): void {
    const var1 = prop + 1;
    const var2 = prop2 + 2;
    return var1 + var2;
};`,
    }),
  ).toStrictEqual([
    {
      type: "function",
      value: "function",
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
      value: "prop",
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
      value: "prop2",
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
      type: "const-variable",
      value: "var1",
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
      value: "prop",
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
      type: "number",
      value: "1",
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
      type: "definition",
      value: "const",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "const-variable",
      value: "var2",
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
      value: "prop2",
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
      type: "number",
      value: "2",
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
      value: "var1",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "operator",
      value: "+",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "variable",
      value: "var2",
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
  ]);
});
