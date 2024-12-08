import { TokenTypes, unicodes } from "@packages/math-parser";
import { UniqueMathMLTokens } from "~/utils/parseTokens/constants";
import { ParsedToken } from "~/utils/parseTokens/types";
import { detectParenthesisTokens } from "~/utils/parseTokens/uniqueOperations/detectContaineredTokens";

type RecursivelyParseFloorArgs = {
  tokens: ParsedToken[];
};

export const recursivelyParseFloor = ({ tokens }: RecursivelyParseFloorArgs) => {
  const value: ParsedToken[] = [
    {
      type: TokenTypes.UNIQUE_TOKEN,
      value: unicodes.javascript.leftFloor,
    },
  ];

  const { tokensWithinTheParenthesis } = detectParenthesisTokens({ tokens, direction: "ltr" });
  value.push(...tokensWithinTheParenthesis.slice(1, tokensWithinTheParenthesis.length - 1));

  value.push({
    type: TokenTypes.UNIQUE_TOKEN,
    value: unicodes.javascript.rightFloor,
  });

  return {
    type: UniqueMathMLTokens.FLOOR,
    value,
  };
};
