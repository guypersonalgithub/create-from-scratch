import { expect, test } from "vitest";
import { parseTypescript } from "../../src";

test("Class flow", () => {
  expect(
    parseTypescript({
      input: `class Example {}

const example = new Example();`,
    }),
  ).toStrictEqual([
    {
      type: "class",
      value: "class",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "class-name",
      value: "Example",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "class-curly-bracket",
      value: "{",
    },
    {
      type: "class-curly-bracket",
      value: "}",
    },
    {
      type: "whitespace",
      value: "\n\n",
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
      type: "new",
      value: "new",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "class-name",
      value: "Example",
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

test("Class flow with public, static, private, numeric and keywordless variables flow", () => {
  expect(
    parseTypescript({
      input: `class Example<T> {
  private props: T;
  static props2: T;
  public props3: T;
  a;
  a2: number
  2
  3 = "a" as any;
}

const example = new Example();`,
    }),
  ).toStrictEqual([
    {
      type: "class",
      value: "class",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "class-name",
      value: "Example",
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
      type: "whitespace",
      value: " ",
    },
    {
      type: "class-curly-bracket",
      value: "{",
    },
    {
      type: "whitespace",
      value: "\n  ",
    },
    {
      type: "private",
      value: "private",
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
      type: "end-of-line",
      value: ";",
    },
    {
      type: "whitespace",
      value: "\n  ",
    },
    {
      type: "static",
      value: "static",
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
      value: "T",
    },
    {
      type: "end-of-line",
      value: ";",
    },
    {
      type: "whitespace",
      value: "\n  ",
    },
    {
      type: "public",
      value: "public",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "variable",
      value: "props3",
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
      type: "end-of-line",
      value: ";",
    },
    {
      type: "whitespace",
      value: "\n  ",
    },
    {
      type: "variable",
      value: "a",
    },
    {
      type: "end-of-line",
      value: ";",
    },
    {
      type: "whitespace",
      value: "\n  ",
    },
    {
      type: "variable",
      value: "a2",
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
      type: "whitespace",
      value: "\n  ",
    },
    {
      type: "numeric-class-variable",
      value: "2",
    },
    {
      type: "whitespace",
      value: "\n  ",
    },
    {
      type: "numeric-class-variable",
      value: "3",
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
      value: '"a"',
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
    {
      type: "whitespace",
      value: "\n",
    },
    {
      type: "class-curly-bracket",
      value: "}",
    },
    {
      type: "whitespace",
      value: "\n\n",
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
      type: "new",
      value: "new",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "class-name",
      value: "Example",
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

test("Class flow with public, static, private, numeric, keywordless variables with constructor flow", () => {
  expect(
    parseTypescript({
      input: `class Example<T> {
  private props: T;
  static props2: T;
  public props3: T;
  a;
  a2: number
  2
  3 = "a" as any;

  constructor(props: T) {
    this.props = props;
  }

}

const example = new Example();`,
    }),
  ).toStrictEqual([
    {
      type: "class",
      value: "class",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "class-name",
      value: "Example",
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
      type: "whitespace",
      value: " ",
    },
    {
      type: "class-curly-bracket",
      value: "{",
    },
    {
      type: "whitespace",
      value: "\n  ",
    },
    {
      type: "private",
      value: "private",
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
      type: "end-of-line",
      value: ";",
    },
    {
      type: "whitespace",
      value: "\n  ",
    },
    {
      type: "static",
      value: "static",
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
      value: "T",
    },
    {
      type: "end-of-line",
      value: ";",
    },
    {
      type: "whitespace",
      value: "\n  ",
    },
    {
      type: "public",
      value: "public",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "variable",
      value: "props3",
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
      type: "end-of-line",
      value: ";",
    },
    {
      type: "whitespace",
      value: "\n  ",
    },
    {
      type: "variable",
      value: "a",
    },
    {
      type: "end-of-line",
      value: ";",
    },
    {
      type: "whitespace",
      value: "\n  ",
    },
    {
      type: "variable",
      value: "a2",
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
      type: "whitespace",
      value: "\n  ",
    },
    {
      type: "numeric-class-variable",
      value: "2",
    },
    {
      type: "whitespace",
      value: "\n  ",
    },
    {
      type: "numeric-class-variable",
      value: "3",
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
      value: '"a"',
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
    {
      type: "whitespace",
      value: "\n\n  ",
    },
    {
      type: "class-constructor",
      value: "constructor",
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
      value: "T",
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
      type: "whitespace",
      value: "\n    ",
    },
    {
      type: "this",
      value: "this",
    },
    {
      type: "operator",
      value: ".",
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
      type: "operator",
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
      type: "end-of-line",
      value: ";",
    },
    {
      type: "whitespace",
      value: "\n  ",
    },
    {
      type: "function-curly-bracket",
      value: "}",
    },
    {
      type: "whitespace",
      value: "\n\n",
    },
    {
      type: "class-curly-bracket",
      value: "}",
    },
    {
      type: "whitespace",
      value: "\n\n",
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
      type: "new",
      value: "new",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "class-name",
      value: "Example",
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

test("Class flow with public, static, private, numeric, keywordless variables, constructor and functions flow", () => {
  expect(
    parseTypescript({
      input: `class Example<T> {
  private props: T;
  static props2: T;
  public props3: T;
  a;
  a2: number
  2
  3 = "a" as any;

  constructor(props: T) {
    this.props = props;
  }

  test(test: string) {
    return test;
  }

  testing = () => {
    console.log("test");
  }
}

const example = new Example();`,
    }),
  ).toStrictEqual([
    {
      type: "class",
      value: "class",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "class-name",
      value: "Example",
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
      type: "whitespace",
      value: " ",
    },
    {
      type: "class-curly-bracket",
      value: "{",
    },
    {
      type: "whitespace",
      value: "\n  ",
    },
    {
      type: "private",
      value: "private",
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
      type: "end-of-line",
      value: ";",
    },
    {
      type: "whitespace",
      value: "\n  ",
    },
    {
      type: "static",
      value: "static",
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
      value: "T",
    },
    {
      type: "end-of-line",
      value: ";",
    },
    {
      type: "whitespace",
      value: "\n  ",
    },
    {
      type: "public",
      value: "public",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "variable",
      value: "props3",
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
      type: "end-of-line",
      value: ";",
    },
    {
      type: "whitespace",
      value: "\n  ",
    },
    {
      type: "variable",
      value: "a",
    },
    {
      type: "end-of-line",
      value: ";",
    },
    {
      type: "whitespace",
      value: "\n  ",
    },
    {
      type: "variable",
      value: "a2",
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
      type: "whitespace",
      value: "\n  ",
    },
    {
      type: "numeric-class-variable",
      value: "2",
    },
    {
      type: "whitespace",
      value: "\n  ",
    },
    {
      type: "numeric-class-variable",
      value: "3",
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
      value: '"a"',
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
    {
      type: "whitespace",
      value: "\n\n  ",
    },
    {
      type: "class-constructor",
      value: "constructor",
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
      value: "T",
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
      type: "whitespace",
      value: "\n    ",
    },
    {
      type: "this",
      value: "this",
    },
    {
      type: "operator",
      value: ".",
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
      type: "operator",
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
      type: "end-of-line",
      value: ";",
    },
    {
      type: "whitespace",
      value: "\n  ",
    },
    {
      type: "function-curly-bracket",
      value: "}",
    },
    {
      type: "whitespace",
      value: "\n\n  ",
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
      value: "test",
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
      value: "\n  ",
    },
    {
      type: "function-curly-bracket",
      value: "}",
    },
    {
      type: "whitespace",
      value: "\n\n  ",
    },
    {
      type: "function-name",
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
      type: "whitespace",
      value: "\n    ",
    },
    {
      type: "variable",
      value: "console",
    },
    {
      type: "operator",
      value: ".",
    },
    {
      type: "invoked-function",
      value: "log",
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
      type: "parenthesis",
      value: ")",
    },
    {
      type: "end-of-line",
      value: ";",
    },
    {
      type: "whitespace",
      value: "\n  ",
    },
    {
      type: "function-curly-bracket",
      value: "}",
    },
    {
      type: "whitespace",
      value: "\n",
    },
    {
      type: "class-curly-bracket",
      value: "}",
    },
    {
      type: "whitespace",
      value: "\n\n",
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
      type: "new",
      value: "new",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "class-name",
      value: "Example",
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

test("Abstract class flow with public, static, private, numeric, keywordless variables, constructor and functions flow", () => {
  expect(
    parseTypescript({
      input: `abstract class Example<T> {
  private props: T;
  static props2: T;
  public props3: T;
  a;
  a2: number
  2
  3 = "a" as any;

  constructor(props: T) {
    this.props = props;
  }

  test(test: string) {
    return test;
  }

  testing = () => {
    console.log("test");
  }
}

const example = new Example();`,
    }),
  ).toStrictEqual([
    {
      type: "abstract",
      value: "abstract",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "class",
      value: "class",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "class-name",
      value: "Example",
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
      type: "whitespace",
      value: " ",
    },
    {
      type: "class-curly-bracket",
      value: "{",
    },
    {
      type: "whitespace",
      value: "\n  ",
    },
    {
      type: "private",
      value: "private",
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
      type: "end-of-line",
      value: ";",
    },
    {
      type: "whitespace",
      value: "\n  ",
    },
    {
      type: "static",
      value: "static",
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
      value: "T",
    },
    {
      type: "end-of-line",
      value: ";",
    },
    {
      type: "whitespace",
      value: "\n  ",
    },
    {
      type: "public",
      value: "public",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "variable",
      value: "props3",
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
      type: "end-of-line",
      value: ";",
    },
    {
      type: "whitespace",
      value: "\n  ",
    },
    {
      type: "variable",
      value: "a",
    },
    {
      type: "end-of-line",
      value: ";",
    },
    {
      type: "whitespace",
      value: "\n  ",
    },
    {
      type: "variable",
      value: "a2",
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
      type: "whitespace",
      value: "\n  ",
    },
    {
      type: "numeric-class-variable",
      value: "2",
    },
    {
      type: "whitespace",
      value: "\n  ",
    },
    {
      type: "numeric-class-variable",
      value: "3",
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
      value: '"a"',
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
    {
      type: "whitespace",
      value: "\n\n  ",
    },
    {
      type: "class-constructor",
      value: "constructor",
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
      value: "T",
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
      type: "whitespace",
      value: "\n    ",
    },
    {
      type: "this",
      value: "this",
    },
    {
      type: "operator",
      value: ".",
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
      type: "operator",
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
      type: "end-of-line",
      value: ";",
    },
    {
      type: "whitespace",
      value: "\n  ",
    },
    {
      type: "function-curly-bracket",
      value: "}",
    },
    {
      type: "whitespace",
      value: "\n\n  ",
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
      value: "test",
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
      value: "\n  ",
    },
    {
      type: "function-curly-bracket",
      value: "}",
    },
    {
      type: "whitespace",
      value: "\n\n  ",
    },
    {
      type: "function-name",
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
      type: "whitespace",
      value: "\n    ",
    },
    {
      type: "variable",
      value: "console",
    },
    {
      type: "operator",
      value: ".",
    },
    {
      type: "invoked-function",
      value: "log",
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
      type: "parenthesis",
      value: ")",
    },
    {
      type: "end-of-line",
      value: ";",
    },
    {
      type: "whitespace",
      value: "\n  ",
    },
    {
      type: "function-curly-bracket",
      value: "}",
    },
    {
      type: "whitespace",
      value: "\n",
    },
    {
      type: "class-curly-bracket",
      value: "}",
    },
    {
      type: "whitespace",
      value: "\n\n",
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
      type: "new",
      value: "new",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "class-name",
      value: "Example",
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
