import { test, expect } from "@packages/test";
import { diff } from "../src";

const from = "CBAD";
const to = "BCDA";
const expected = {
  result: [
    { type: "DELETED", value: "C" },
    { type: "UNCHANGED", value: "B" },
    { type: "DELETED", value: "A" },
    { type: "ADDED", value: "C" },
    { type: "UNCHANGED", value: "D" },
    { type: "ADDED", value: "A" },
  ],
};

test({
  name: "Diff",
  fn: () => expect({ value: diff({ from, to }) }).toEqual({ expected }),
});
