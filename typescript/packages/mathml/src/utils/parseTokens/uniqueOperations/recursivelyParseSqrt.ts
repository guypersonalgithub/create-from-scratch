import { TokenTypes } from "@packages/math-parser";
import { detectAbsoluteTokens, detectParenthesisTokens } from "./detectContaineredTokens";
import { type ParsedToken } from "../types";
import { recursiveOperations } from "./recursiveOperations";
import { UniqueMathMLTokens } from "../constants";

type RecursivelyParseSqrtArgs = {
  tokens: ParsedToken[];
};

export const recursivelyParseSqrt = ({ tokens }: RecursivelyParseSqrtArgs) => {
  const value: ParsedToken[] = [];

  const initialToken = tokens[0];

  if (initialToken.value === "(") {
    const { tokensWithinTheParenthesis } = detectParenthesisTokens({ tokens, direction: "ltr" });
    value.push(...tokensWithinTheParenthesis.slice(1, tokensWithinTheParenthesis.length - 1));
  } else if (initialToken.value === "|") {
    const { tokensWithinTheAbsolute } = detectAbsoluteTokens({ tokens, direction: "ltr" });
    value.push(...tokensWithinTheAbsolute);
  } else {
    let token = tokens.shift() as ParsedToken | undefined;

    if (!token) {
      throw new Error("Unexpected syntax!");
    }

    recursiveOperations({ tokens, token, parsedTokensOfTheSameLevel: value });

    while (
      (token = tokens.shift()) &&
      (token?.type === UniqueMathMLTokens.SQRT ||
        token?.type === UniqueMathMLTokens.POWER ||
        token?.type === TokenTypes.VALUE ||
        token?.type === TokenTypes.VARIABLE ||
        typeof token?.value !== "string")
    ) {
      recursiveOperations({ tokens, token, parsedTokensOfTheSameLevel: value });
    }
  }

  return {
    type: UniqueMathMLTokens.SQRT,
    value,
  };
};
