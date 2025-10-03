import type { BaseToken } from "@packages/parse-css";

export type Section = {
  tokens: BaseToken[];
  startOffset: number;
  endOffset: number;
};

export type CachedParsedFileSections = Section[];
