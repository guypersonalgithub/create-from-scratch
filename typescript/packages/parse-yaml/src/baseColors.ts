import { TokenTypeOptions, TokenTypes } from "./constants";

export const baseColors: Record<TokenTypeOptions, string> = {
  [TokenTypes.STRING_KEY]: "#4A9CB3",
  [TokenTypes.NUMERIC_KEY]: "lightGreen",
  [TokenTypes.STRING_VALUE]: "#CE723C",
  [TokenTypes.NUMERIC_VALUE]: "lightGreen",
  [TokenTypes.COMMENT]: "darkGreen",
  [TokenTypes.OBJECT_CURLY_BRACKET]: "white",
  [TokenTypes.END_OF_LINE]: "white",
  [TokenTypes.WHITESPACE]: "white",
  [TokenTypes.OPERATOR]: "white",
  [TokenTypes.ARRAY_SQUARE_BRACKET]: "white",
  [TokenTypes.UNKNOWN]: "white",
};
