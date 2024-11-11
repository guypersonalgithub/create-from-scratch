import { TokenTypes } from "@packages/math-parser";
import { ParsedToken } from "../types";
import { detectParenthesisTokens } from "./detectParenthesisOrAbsolute";
import { UniqueMathMLTokens } from "../constants";

type RecursivelyParseLogArgs = {
  tokens: ParsedToken[];
};

export const recursivelyParseLog = ({ tokens }: RecursivelyParseLogArgs) => {
  const func = {
    type: TokenTypes.UNIQUE_TOKEN,
    value: "log",
  };
  const base: ParsedToken[] = [];
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

  return {
    type: UniqueMathMLTokens.LOG,
    value: {
      func,
      base,
      value,
    },
  };
};
