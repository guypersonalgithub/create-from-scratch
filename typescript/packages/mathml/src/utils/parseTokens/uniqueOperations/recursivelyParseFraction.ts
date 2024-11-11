import { TokenTypes } from "@packages/math-parser";
import { ParsedToken } from "../types";
import { detectAbsoluteTokens, detectParenthesisTokens } from "./detectParenthesisOrAbsolute";
import { recursiveOperations } from "./recursiveOperations";
import { UniqueMathMLTokens } from "../constants";

type RecursivelyParseFractionArgs = {
  tokens: ParsedToken[];
  parsedTokensOfTheSameLevel: ParsedToken[];
};

export const recursivelyParseFraction = ({
  tokens,
  parsedTokensOfTheSameLevel,
}: RecursivelyParseFractionArgs) => {
  const denominator: ParsedToken[] = [];

  const initialToken = tokens[0];

  if (initialToken.value === "(") {
    const { tokensWithinTheParenthesis } = detectParenthesisTokens({ tokens, direction: "ltr" });
    denominator.push(...tokensWithinTheParenthesis.slice(1, tokensWithinTheParenthesis.length - 1));
  } else if (initialToken.value === "|") {
    const { tokensWithinTheAbsolute } = detectAbsoluteTokens({ tokens, direction: "ltr" });
    denominator.push(...tokensWithinTheAbsolute);
  } else {
    let token = tokens.shift() as ParsedToken | undefined;

    if (!token) {
      throw new Error("Unexpected syntax!");
    }

    if (token.value !== "(" && token.value !== "/") {
      denominator.push(initialToken);
    }

    while (
      (token = tokens.shift()) &&
      (token?.value === "^" ||
        token?.value === "sqrt" ||
        token?.type === TokenTypes.VALUE ||
        token?.type === TokenTypes.VARIABLE ||
        typeof token?.value !== "string")
    ) {
      recursiveOperations({ tokens, token, parsedTokensOfTheSameLevel: denominator });
    }

    if (token) {
      tokens.unshift(token);
    }
  }

  const numerator: ParsedToken[] = [];

  const lastValueToken = parsedTokensOfTheSameLevel[parsedTokensOfTheSameLevel.length - 1];

  if (lastValueToken.value === ")") {
    const { tokensWithinTheParenthesis } = detectParenthesisTokens({
      tokens: parsedTokensOfTheSameLevel,
      direction: "rtl",
    });
    numerator.push(...tokensWithinTheParenthesis.slice(1, tokensWithinTheParenthesis.length - 1));
  } else if (lastValueToken.value === "|") {
    const { tokensWithinTheAbsolute } = detectAbsoluteTokens({
      tokens: parsedTokensOfTheSameLevel,
      direction: "rtl",
    });
    numerator.push(...tokensWithinTheAbsolute);
  } else {
    let token = parsedTokensOfTheSameLevel.pop() as ParsedToken | undefined;
    if (token) {
      numerator.unshift(token);
    }

    while (
      (token = parsedTokensOfTheSameLevel.pop()) &&
      (token?.type === UniqueMathMLTokens.SQRT ||
        token?.type === UniqueMathMLTokens.POWER ||
        token?.type === TokenTypes.VALUE ||
        token?.type === TokenTypes.VARIABLE ||
        typeof token?.value !== "string")
    ) {
      numerator.unshift(token);
    }

    if (token) {
      parsedTokensOfTheSameLevel.push(token);
    }
  }

  return {
    type: UniqueMathMLTokens.FRACTION,
    value: {
      numerator,
      denominator,
    },
  };
};
