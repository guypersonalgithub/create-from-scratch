import { TokenTypes } from "~/tokenizer/constants";

export type BaseToken = {
  type: TokenTypes;
  value: string;
};
