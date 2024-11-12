import { TokenTypes } from "@packages/math-parser";
import { ParsedToken } from "../types";
import { detectAbsoluteTokens, detectParenthesisTokens } from "./detectParenthesisOrAbsolute";
import { recursiveOperations } from "./recursiveOperations";
import { UniqueMathMLTokens } from "../constants";

type RecursivelyParseWithBackwardsArgs = {
  tokens: ParsedToken[];
  parsedTokensOfTheSameLevel: ParsedToken[];
  isRoot?: boolean;
};

export const recursivelyParsePower = ({
  tokens,
  parsedTokensOfTheSameLevel,
  isRoot,
}: RecursivelyParseWithBackwardsArgs) => {
  const power: ParsedToken[] = [];

  const initialToken = tokens[0];

  if (initialToken.value === "(") {
    const { tokensWithinTheParenthesis } = detectParenthesisTokens({
      tokens,
      direction: "ltr",
      isRoot
    });
    const shouldRemoveParenthesis = tokens?.[0]?.value !== "^";
    const pushedTokens = shouldRemoveParenthesis
      ? tokensWithinTheParenthesis.slice(1, tokensWithinTheParenthesis.length - 1)
      : tokensWithinTheParenthesis;
    power.push(...pushedTokens);
  } else if (initialToken.value === "|") {
    const { tokensWithinTheAbsolute } = detectAbsoluteTokens({ tokens, direction: "ltr" });
    power.push(...tokensWithinTheAbsolute);
  } else {
    let token = tokens.shift() as ParsedToken | undefined;

    if (!token) {
      throw new Error("Unexpected syntax!");
    }

    if (token.value !== "(" && token.value !== "^") {
      power.push(initialToken);
    }

    while (
      (token = tokens.shift()) &&
      (token?.type === UniqueMathMLTokens.SQRT ||
        token?.type === UniqueMathMLTokens.POWER ||
        token?.type === TokenTypes.VALUE ||
        token?.type === TokenTypes.VARIABLE ||
        typeof token?.value !== "string")
    ) {
      recursiveOperations({ tokens, token, parsedTokensOfTheSameLevel: power });
    }

    if (token) {
      tokens.unshift(token);
    }
  }

  const base: ParsedToken[] = [];

  const lastValueToken = parsedTokensOfTheSameLevel[parsedTokensOfTheSameLevel.length - 1];

  if (lastValueToken.value === ")") {
    const { tokensWithinTheParenthesis } = detectParenthesisTokens({
      tokens: parsedTokensOfTheSameLevel,
      direction: "rtl",
    });
    base.push(...tokensWithinTheParenthesis);
  } else if (lastValueToken.value === "|") {
    const { tokensWithinTheAbsolute } = detectAbsoluteTokens({
      tokens: parsedTokensOfTheSameLevel,
      direction: "rtl",
    });
    base.push(...tokensWithinTheAbsolute);
  } else {
    let token = parsedTokensOfTheSameLevel.pop() as ParsedToken | undefined;
    if (token) {
      base.unshift(token);
    }

    while (
      (token = parsedTokensOfTheSameLevel.pop()) &&
      (token?.type === UniqueMathMLTokens.SQRT ||
        token?.type === UniqueMathMLTokens.POWER ||
        token?.type === TokenTypes.VALUE ||
        token?.type === TokenTypes.VARIABLE ||
        typeof token?.value !== "string")
    ) {
      base.unshift(token);
    }

    if (token) {
      parsedTokensOfTheSameLevel.push(token);
    }
  }

  return {
    type: UniqueMathMLTokens.POWER,
    value: {
      base,
      power,
    },
  };
};
