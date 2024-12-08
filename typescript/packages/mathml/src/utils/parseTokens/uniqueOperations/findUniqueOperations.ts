import { TokenTypes } from "@packages/math-parser";
import { ParsedToken } from "~/utils/parseTokens/types";
import { uniqueOperationsFlow } from "~/utils/parseTokens/uniqueOperations/uniqueOperationsFlow";

type FindUniqueOperationsArgs = {
  tokens: ParsedToken[];
  token: ParsedToken;
  parsedTokens: ParsedToken[];
};

export const findUniqueOperations = ({ tokens, token, parsedTokens }: FindUniqueOperationsArgs) => {
  const { type, value } = token;

  if (
    type !== TokenTypes.KEYWORD &&
    type !== TokenTypes.UNIQUE_OPERATION &&
    typeof value === "string"
  ) {
    return false;
  }

  uniqueOperationsFlow({ tokens, token, parsedTokens });
  return true;
};
