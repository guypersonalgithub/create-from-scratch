import { TokenTypes, unicodes } from "@packages/math-parser";
import { type ParsedToken } from "../types";
import { UniqueMathMLTokens } from "../constants";
import { detectParenthesisTokens } from "./detectContaineredTokens";

type RecursivelyParseLimitArgs = {
  tokens: ParsedToken[];
};

const arrow = unicodes.javascript.arrow;

export const recursivelyParseLimit = ({ tokens }: RecursivelyParseLimitArgs) => {
  const lim: ParsedToken = {
    type: TokenTypes.UNIQUE_TOKEN,
    value: "lim",
  };

  const { tokensWithinTheParenthesis } = detectParenthesisTokens({
    tokens,
    direction: "ltr",
  });

  const tokensWithoutParenthesis = tokensWithinTheParenthesis.slice(
    1,
    tokensWithinTheParenthesis.length - 1,
  );
  const arrowIndex = tokensWithoutParenthesis.findIndex((token) => token.value === arrow);
  const variables = tokensWithoutParenthesis.slice(0, arrowIndex);
  const values = tokensWithoutParenthesis.slice(arrowIndex + 1);

  const valuesMatrix: ParsedToken[][] = [[]];
  let currentValueArray = 0;
  for (let i = 0; i < values.length; i++) {
    const current = values[i];
    if (current.value === ",") {
      currentValueArray++;
      valuesMatrix.push([]);
    }

    valuesMatrix[currentValueArray].push(current);
  }

  return {
    type: UniqueMathMLTokens.LIMIT,
    value: {
      lim,
      arrow: tokensWithoutParenthesis[arrowIndex],
      variables,
      values: valuesMatrix,
    },
  };
};
