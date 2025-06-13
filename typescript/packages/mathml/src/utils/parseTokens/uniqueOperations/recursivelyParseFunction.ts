import { TokenTypes } from "@packages/math-parser";
import { type ParsedToken } from "../types";
import { detectAbsoluteTokens, detectParenthesisTokens } from "./detectContaineredTokens";
import { recursiveOperations } from "./recursiveOperations";
import { UniqueMathMLTokens } from "../constants";
import { uniqueFunctionWithPower } from "./uniqueFunctionWithPower";

type RecursivelyParseUniqueFunctionArgs = {
  func: string;
  tokens: ParsedToken[];
  isRoot?: boolean;
};

export const recursivelyParseUniqueFunction = ({
  func,
  tokens,
  isRoot,
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
      (token?.type === UniqueMathMLTokens.SQRT ||
        token?.type === UniqueMathMLTokens.POWER ||
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

  const changedPowerLocation = uniqueFunctionWithPower({ value, tokens });

  return {
    type: UniqueMathMLTokens.UNIQUE_FUNCTION,
    value,
    changedPowerLocation,
    isRootFunction: isRoot === undefined,
  };
};
