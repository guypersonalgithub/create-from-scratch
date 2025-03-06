import { expect, test } from "vitest";
import { parseTypescript } from "../../src";

test("Basic import flow", () => {
  expect(parseTypescript({ input: 'import test from "testing";' })).toStrictEqual([
    {
      type: "import",
      value: "import",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "import-variable",
      value: "test",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "from",
      value: "from",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "string",
      value: '"testing"',
    },
    {
      type: "end-of-line",
      value: ";",
    },
  ]);
});

test("Importing multiple properties", () => {
  expect(parseTypescript({ input: 'import { one, two } from "testing";' })).toStrictEqual([
    {
      type: "import",
      value: "import",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "import-curly-bracket",
      value: "{",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "import-variable",
      value: "one",
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
      type: "import-variable",
      value: "two",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "import-curly-bracket",
      value: "}",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "from",
      value: "from",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "string",
      value: '"testing"',
    },
    {
      type: "end-of-line",
      value: ";",
    },
  ]);
});

test("Importing export default and multiple properties", () => {
  expect(parseTypescript({ input: 'import test, { one, two } from "testing";' })).toStrictEqual([
    {
      type: "import",
      value: "import",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "import-variable",
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
      type: "import-curly-bracket",
      value: "{",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "import-variable",
      value: "one",
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
      type: "import-variable",
      value: "two",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "import-curly-bracket",
      value: "}",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "from",
      value: "from",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "string",
      value: '"testing"',
    },
    {
      type: "end-of-line",
      value: ";",
    },
  ]);
});

test("Importing export with name casting", () => {
  expect(
    parseTypescript({ input: 'import test, { one as three, two } from "testing";' }),
  ).toStrictEqual([
    {
      type: "import",
      value: "import",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "import-variable",
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
      type: "import-curly-bracket",
      value: "{",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "import-variable",
      value: "one",
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
      type: "import-variable",
      value: "three",
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
      type: "import-variable",
      value: "two",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "import-curly-bracket",
      value: "}",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "from",
      value: "from",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "string",
      value: '"testing"',
    },
    {
      type: "end-of-line",
      value: ";",
    },
  ]);
});
