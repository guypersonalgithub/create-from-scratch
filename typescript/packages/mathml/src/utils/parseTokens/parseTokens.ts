import { BaseToken } from "@packages/math-parser";
import { ParsedToken } from "./types";
import { findUniqueOperations } from "./uniqueOperations";

type ParseTokensArgs = {
  tokens: BaseToken[];
};

export const parseTokens = ({ tokens }: ParseTokensArgs) => {
  const parsedTokens: ParsedToken[] = [];
  let errorMessage: string | undefined;

  try {
    const tokensCopy = tokens.slice();

    while (tokensCopy.length > 0) {
      const token = tokensCopy.shift();

      if (!token) {
        throw new Error("Unexpected syntax!");
      }

      const foundUniqueOprator = findUniqueOperations({
        tokens: tokensCopy,
        token,
        parsedTokens,
      });

      if (!foundUniqueOprator) {
        parsedTokens.push(token);
      }
    }
  } catch (error) {
    const isError = error instanceof Error;
    errorMessage = `Error executing command: ${isError ? error.message : error}`;
  }

  return {
    parsedTokens,
    errorMessage,
  };
};
