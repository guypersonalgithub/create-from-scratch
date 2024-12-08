import { ParsedToken } from "~/utils/parseTokens/types";
import { uniqueOperationsFlow } from "~/utils/parseTokens/uniqueOperations/uniqueOperationsFlow";

type RecursiveOperationsArgs = {
  tokens: ParsedToken[];
  token: ParsedToken;
  parsedTokensOfTheSameLevel: ParsedToken[];
  isRoot?: boolean;
};

export const recursiveOperations = ({
  tokens,
  token,
  parsedTokensOfTheSameLevel,
  isRoot,
}: RecursiveOperationsArgs) => {
  if (typeof token?.value !== "string") {
    parsedTokensOfTheSameLevel.push(token);
    return;
  }

  uniqueOperationsFlow({ tokens, token, parsedTokens: parsedTokensOfTheSameLevel, isRoot });
};
