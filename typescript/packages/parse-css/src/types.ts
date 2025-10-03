import type { TokenTypeOptions } from "./constants";

export type BaseToken = {
  type: TokenTypeOptions;
  value: string;
  startIndex: number;
  endIndex: number;
};

export type Callback = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  cssInJS?: boolean;
  extensionParsing?: boolean;
};
