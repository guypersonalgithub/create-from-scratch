import { UniqueMathMLTokens } from "~/utils/parseTokens/constants";
import { ParsedToken } from "~/utils/parseTokens/types";
import { detectParenthesisTokens } from "~/utils/parseTokens/uniqueOperations/detectContaineredTokens";

type RecursivelyParseCancelArgs = {
  tokens: ParsedToken[];
};

export const recursivelyParseCancel = ({ tokens }: RecursivelyParseCancelArgs) => {
  const value: ParsedToken[] = [];

  const { tokensWithinTheParenthesis } = detectParenthesisTokens({ tokens, direction: "ltr" });
  value.push(...tokensWithinTheParenthesis.slice(1, tokensWithinTheParenthesis.length - 1));

  return {
    type: UniqueMathMLTokens.CANCEL,
    value,
  };
};
