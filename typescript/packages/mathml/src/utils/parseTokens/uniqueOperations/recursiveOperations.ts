import { ParsedToken } from "../types";
import { uniqueOperationsFlow } from "./uniqueOperationsFlow";

type RecursiveOperationsArgs = {
  tokens: ParsedToken[];
  token: ParsedToken;
  parsedTokensOfTheSameLevel: ParsedToken[];
};

export const recursiveOperations = ({
  tokens,
  token,
  parsedTokensOfTheSameLevel,
}: RecursiveOperationsArgs) => {
  if (typeof token?.value !== "string") {
    parsedTokensOfTheSameLevel.push(token);
    return;
  }

  uniqueOperationsFlow({ tokens, token, parsedTokens: parsedTokensOfTheSameLevel });
};
