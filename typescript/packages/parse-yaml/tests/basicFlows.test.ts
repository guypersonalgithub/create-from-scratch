import { expect, test } from "vitest";
import { parseYaml } from "../src";

test("Basic flow", () => {
  expect(
    parseYaml({
      input: `name: Syntax-Highlighter tests
on:
  pull_request:
    branches:
      - main
    types:
      - opened
      - synchronize
      - reopened
    paths:
      - typescript/packages/syntax-highlighter/**
      - typescript/packages/utils/**
jobs:
  Syntax-Highlighter-tests:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./typescript
    steps:
      - uses: actions/checkout@v4
      - name: Remove postinstall
        run: node ./ci-scripts/removePostInstall.js cs
      - name: Install dependencies
        run: npm i
      - name: Run tests
        run: cd packages/syntax-highlighter && npm run test`,
    }),
  ).toStrictEqual([
    {
      type: "string-key",
      value: "name",
    },
    {
      type: "operator",
      value: ":",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "string-value",
      value: "Syntax-Highlighter tests",
    },
    {
      type: "end-of-line",
      value: "\n",
    },
    {
      type: "string-key",
      value: "on",
    },
    {
      type: "operator",
      value: ":",
    },
    {
      type: "end-of-line",
      value: "\n",
    },
    {
      type: "whitespace",
      value: "  ",
    },
    {
      type: "string-key",
      value: "pull_request",
    },
    {
      type: "operator",
      value: ":",
    },
    {
      type: "end-of-line",
      value: "\n",
    },
    {
      type: "whitespace",
      value: "    ",
    },
    {
      type: "string-key",
      value: "branches",
    },
    {
      type: "operator",
      value: ":",
    },
    {
      type: "end-of-line",
      value: "\n",
    },
    {
      type: "whitespace",
      value: "      ",
    },
    {
      type: "operator",
      value: "-",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "string-value",
      value: "main",
    },
    {
      type: "end-of-line",
      value: "\n",
    },
    {
      type: "whitespace",
      value: "    ",
    },
    {
      type: "string-key",
      value: "types",
    },
    {
      type: "operator",
      value: ":",
    },
    {
      type: "end-of-line",
      value: "\n",
    },
    {
      type: "whitespace",
      value: "      ",
    },
    {
      type: "operator",
      value: "-",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "string-value",
      value: "opened",
    },
    {
      type: "end-of-line",
      value: "\n",
    },
    {
      type: "whitespace",
      value: "      ",
    },
    {
      type: "operator",
      value: "-",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "string-value",
      value: "synchronize",
    },
    {
      type: "end-of-line",
      value: "\n",
    },
    {
      type: "whitespace",
      value: "      ",
    },
    {
      type: "operator",
      value: "-",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "string-value",
      value: "reopened",
    },
    {
      type: "end-of-line",
      value: "\n",
    },
    {
      type: "whitespace",
      value: "    ",
    },
    {
      type: "string-key",
      value: "paths",
    },
    {
      type: "operator",
      value: ":",
    },
    {
      type: "end-of-line",
      value: "\n",
    },
    {
      type: "whitespace",
      value: "      ",
    },
    {
      type: "operator",
      value: "-",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "string-value",
      value: "typescript/packages/syntax-highlighter/**",
    },
    {
      type: "end-of-line",
      value: "\n",
    },
    {
      type: "whitespace",
      value: "      ",
    },
    {
      type: "operator",
      value: "-",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "string-value",
      value: "typescript/packages/utils/**",
    },
    {
      type: "end-of-line",
      value: "\n",
    },
    {
      type: "string-key",
      value: "jobs",
    },
    {
      type: "operator",
      value: ":",
    },
    {
      type: "end-of-line",
      value: "\n",
    },
    {
      type: "whitespace",
      value: "  ",
    },
    {
      type: "string-key",
      value: "Syntax-Highlighter-tests",
    },
    {
      type: "operator",
      value: ":",
    },
    {
      type: "end-of-line",
      value: "\n",
    },
    {
      type: "whitespace",
      value: "    ",
    },
    {
      type: "string-key",
      value: "runs-on",
    },
    {
      type: "operator",
      value: ":",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "string-value",
      value: "ubuntu-latest",
    },
    {
      type: "end-of-line",
      value: "\n",
    },
    {
      type: "whitespace",
      value: "    ",
    },
    {
      type: "string-key",
      value: "defaults",
    },
    {
      type: "operator",
      value: ":",
    },
    {
      type: "end-of-line",
      value: "\n",
    },
    {
      type: "whitespace",
      value: "      ",
    },
    {
      type: "string-key",
      value: "run",
    },
    {
      type: "operator",
      value: ":",
    },
    {
      type: "end-of-line",
      value: "\n",
    },
    {
      type: "whitespace",
      value: "        ",
    },
    {
      type: "string-key",
      value: "working-directory",
    },
    {
      type: "operator",
      value: ":",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "string-value",
      value: "./typescript",
    },
    {
      type: "end-of-line",
      value: "\n",
    },
    {
      type: "whitespace",
      value: "    ",
    },
    {
      type: "string-key",
      value: "steps",
    },
    {
      type: "operator",
      value: ":",
    },
    {
      type: "end-of-line",
      value: "\n",
    },
    {
      type: "whitespace",
      value: "      ",
    },
    {
      type: "operator",
      value: "-",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "string-key",
      value: "uses",
    },
    {
      type: "operator",
      value: ":",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "string-value",
      value: "actions/checkout@v4",
    },
    {
      type: "end-of-line",
      value: "\n",
    },
    {
      type: "whitespace",
      value: "      ",
    },
    {
      type: "operator",
      value: "-",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "string-key",
      value: "name",
    },
    {
      type: "operator",
      value: ":",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "string-value",
      value: "Remove postinstall",
    },
    {
      type: "end-of-line",
      value: "\n",
    },
    {
      type: "whitespace",
      value: "        ",
    },
    {
      type: "string-key",
      value: "run",
    },
    {
      type: "operator",
      value: ":",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "string-value",
      value: "node ./ci-scripts/removePostInstall.js cs",
    },
    {
      type: "end-of-line",
      value: "\n",
    },
    {
      type: "whitespace",
      value: "      ",
    },
    {
      type: "operator",
      value: "-",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "string-key",
      value: "name",
    },
    {
      type: "operator",
      value: ":",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "string-value",
      value: "Install dependencies",
    },
    {
      type: "end-of-line",
      value: "\n",
    },
    {
      type: "whitespace",
      value: "        ",
    },
    {
      type: "string-key",
      value: "run",
    },
    {
      type: "operator",
      value: ":",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "string-value",
      value: "npm i",
    },
    {
      type: "end-of-line",
      value: "\n",
    },
    {
      type: "whitespace",
      value: "      ",
    },
    {
      type: "operator",
      value: "-",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "string-key",
      value: "name",
    },
    {
      type: "operator",
      value: ":",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "string-value",
      value: "Run tests",
    },
    {
      type: "end-of-line",
      value: "\n",
    },
    {
      type: "whitespace",
      value: "        ",
    },
    {
      type: "string-key",
      value: "run",
    },
    {
      type: "operator",
      value: ":",
    },
    {
      type: "whitespace",
      value: " ",
    },
    {
      type: "string-value",
      value: "cd packages/syntax-highlighter && npm run test",
    },
  ]);
});
