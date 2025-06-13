import { TokenTypes } from "@packages/math-parser";
import { type ParsedToken } from "../types";
import { detectParenthesisTokens } from "./detectContaineredTokens";
import { UniqueMathMLTokens } from "../constants";
import { uniqueFunctionWithPower } from "./uniqueFunctionWithPower";

type RecursivelyParseLogArgs = {
  tokens: ParsedToken[];
  isRoot?: boolean;
};

export const recursivelyParseLog = ({ tokens, isRoot }: RecursivelyParseLogArgs) => {
  const base: ParsedToken[] = [
    {
      type: TokenTypes.UNIQUE_TOKEN,
      value: "log",
    },
  ];
  const value: ParsedToken[] = [];

  const initialToken = tokens[0];

  if (initialToken.value === "(") {
    const { tokensWithinTheParenthesis } = detectParenthesisTokens({
      tokens,
      direction: "ltr",
    });
    const parenthesisLessTokens = tokensWithinTheParenthesis.slice(
      1,
      tokensWithinTheParenthesis.length - 1,
    );
    const comaToken = parenthesisLessTokens.findIndex((token) => token.value === ",");
    if (comaToken === -1) {
      throw new Error("Unexpected syntax");
    }

    for (let i = 0; i < comaToken; i++) {
      const current = parenthesisLessTokens[i];
      base.push(current);
    }

    for (let i = comaToken + 1; i < parenthesisLessTokens.length; i++) {
      const current = parenthesisLessTokens[i];
      value.push(current);
    }
  }

  const changedPowerLocation = uniqueFunctionWithPower({ value: base, tokens });

  return {
    type: UniqueMathMLTokens.LOG,
    value: {
      func: base[0],
      base: base.slice(1),
      value,
    },
    changedPowerLocation,
    isRootLog: isRoot === undefined,
  };
};
