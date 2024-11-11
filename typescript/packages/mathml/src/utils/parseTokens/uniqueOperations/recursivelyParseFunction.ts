import { TokenTypes } from "@packages/math-parser";
import { ParsedToken } from "../types";
import { detectAbsoluteTokens, detectParenthesisTokens } from "./detectParenthesisOrAbsolute";
import { recursiveOperations } from "./recursiveOperations";
import { UniqueMathMLTokens } from "../constants";

type RecursivelyParseUniqueFunctionArgs = {
  func: string;
  tokens: ParsedToken[];
};

export const recursivelyParseUniqueFunction = ({
  func,
  tokens,
}: RecursivelyParseUniqueFunctionArgs) => {
  const value: ParsedToken[] = [
    {
      type: TokenTypes.UNIQUE_TOKEN,
      value: func,
    },
  ];

  const initialToken = tokens[0];

  if (initialToken.value === "(") {
    const { tokensWithinTheParenthesis } = detectParenthesisTokens({
      tokens,
      direction: "ltr",
    });
    value.push(...tokensWithinTheParenthesis);
  } else if (initialToken.value === "|") {
    const { tokensWithinTheAbsolute } = detectAbsoluteTokens({ tokens, direction: "ltr" });
    value.push(...tokensWithinTheAbsolute);
  } else {
    let token = undefined as ParsedToken | undefined;

    while (
      (token = tokens.shift()) &&
      (token?.value === "^" ||
        token?.value === "sqrt" ||
        token?.type === TokenTypes.VALUE ||
        token?.type === TokenTypes.VARIABLE ||
        typeof token?.value !== "string")
    ) {
      recursiveOperations({ tokens, token, parsedTokensOfTheSameLevel: value });
    }

    if (token) {
      tokens.unshift(token);
    }
  }

  //   if (initialToken.value === "^") {
  //     const { tokensWithinTheParenthesis } = detectParenthesisTokens({
  //       tokens,
  //       direction: "ltr",
  //     });
  //     value.push(...tokensWithinTheParenthesis);
  //   }

  return {
    type: UniqueMathMLTokens.UNIQUE_FUNCTION,
    value,
  };
};
