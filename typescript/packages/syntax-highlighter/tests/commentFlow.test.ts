import { expect, test } from "vitest";
import { parseTypescript } from "../src";

test("Single line comment flow", () => {
  expect(parseTypescript({ input: "// comment" })).toStrictEqual([
    {
      type: "comment",
      value: "// comment",
    },
  ]);
});

test("Multi line comment flow", () => {
  expect(
    parseTypescript({
      input: `/*
        Another comment
    */`,
    }),
  ).toStrictEqual([
    {
      type: "comment",
      value: "/*\n        Another comment\n    */",
    },
  ]);
});
