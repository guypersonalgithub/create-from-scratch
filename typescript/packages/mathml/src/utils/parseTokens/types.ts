import { BaseToken } from "@packages/math-parser";
import { UniqueMathMLTokens } from "./constants";

export type TokenGroup = { type: UniqueMathMLTokens; value: ParsedToken[] };
export type FracionToken = {
  type: UniqueMathMLTokens;
  value: { numerator: ParsedToken[]; denominator: ParsedToken[] };
};
export type PowerToken = {
  type: UniqueMathMLTokens;
  value: { base: ParsedToken[]; power: ParsedToken[] };
};
export type UniqueFunctionToken = {
  type: UniqueMathMLTokens;
  value: ParsedToken[];
};
export type LogToken = {
  type: UniqueMathMLTokens;
  value: { func: ParsedToken; base: ParsedToken[]; value: ParsedToken[] };
};
export type LimitToken = {
  type: UniqueMathMLTokens;
  value: {
    lim: ParsedToken;
    arrow: ParsedToken;
    variables: ParsedToken[];
    values: ParsedToken[][];
  };
};
export type ParsedToken =
  | BaseToken
  | TokenGroup
  | FracionToken
  | PowerToken
  | UniqueFunctionToken
  | LogToken
  | LimitToken;
