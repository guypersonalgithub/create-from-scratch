import type { BaseToken } from "@packages/parse-css";

export type BaseSection = {
  start: number;
  end: number;
};

export type Section = {
  tokens: BaseToken[];
  startOffset: number;
  endOffset: number;
};

export type CachedParsedFileSections = Section[];
