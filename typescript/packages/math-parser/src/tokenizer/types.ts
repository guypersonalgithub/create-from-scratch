import { TokenTypes } from "./constants";

export type BaseToken = {
  type: TokenTypes;
  value: string;
};
