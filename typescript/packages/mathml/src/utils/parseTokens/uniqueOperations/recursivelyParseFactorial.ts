import { TokenTypes } from "@packages/math-parser";
import { ParsedToken } from "../types";
import { detectAbsoluteTokens, detectParenthesisTokens } from "./detectParenthesisOrAbsolute";
import { UniqueMathMLTokens } from "../constants";

type RecursivelyParseFactorialArgs = {
  parsedTokensOfTheSameLevel: ParsedToken[];
};

export const recursivelyParseFactorial = ({
  parsedTokensOfTheSameLevel,
}: RecursivelyParseFactorialArgs) => {
  const value: ParsedToken[] = [];

  const lastValueToken = parsedTokensOfTheSameLevel[parsedTokensOfTheSameLevel.length - 1];

  if (lastValueToken.value === ")") {
    const { tokensWithinTheParenthesis } = detectParenthesisTokens({
      tokens: parsedTokensOfTheSameLevel,
      direction: "rtl",
    });
    value.push(...tokensWithinTheParenthesis);
  } else if (lastValueToken.value === "|") {
    const { tokensWithinTheAbsolute } = detectAbsoluteTokens({
      tokens: parsedTokensOfTheSameLevel,
      direction: "rtl",
    });
    value.push(...tokensWithinTheAbsolute);
  } else {
    let token = parsedTokensOfTheSameLevel.pop() as ParsedToken | undefined;
    if (token) {
      value.unshift(token);
    }

    while (
      (token = parsedTokensOfTheSameLevel.pop()) &&
      (token?.type === UniqueMathMLTokens.SQRT ||
        token?.type === UniqueMathMLTokens.POWER ||
        token?.type === TokenTypes.VALUE ||
        token?.type === TokenTypes.VARIABLE ||
        (token?.type !== UniqueMathMLTokens.LIMIT && typeof token?.value !== "string"))
    ) {
      value.unshift(token);
    }

    if (token) {
      parsedTokensOfTheSameLevel.push(token);
    }
  }

  value.push({
    type: TokenTypes.UNIQUE_TOKEN,
    value: "!",
  });

  return {
    type: UniqueMathMLTokens.FACTORIAL,
    value,
  };
};
