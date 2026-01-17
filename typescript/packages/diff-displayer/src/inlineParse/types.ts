import type { ParsedDiff } from "../types";

export type InlineParseArgs = {
  oldVersion: ParsedDiff[];
  newVersion: ParsedDiff[];
  addEmptyIndexes: Set<number>;
  removeEmptyIndexes: Set<number>;
};