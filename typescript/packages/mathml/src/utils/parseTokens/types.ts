import { BaseToken } from "@packages/math-parser";

export type TokenGroup = { type: string; value: ParsedToken[] };
export type FracionToken = {
  type: string;
  value: { numerator: ParsedToken[]; denominator: ParsedToken[] };
};
export type PowerToken = {
  type: string;
  value: { base: ParsedToken[]; power: ParsedToken[] };
};
export type ParsedToken = BaseToken | TokenGroup | FracionToken | PowerToken;
