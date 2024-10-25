import { BaseToken } from "@packages/math-parser";
import { ParsedToken } from "./types";
import { convertMinuses, convertMultiplications } from "./converts";
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

      const convertedMinus = convertMinuses({
        token,
        nextToken: tokensCopy[0],
        parsedTokens,
        tokens: tokensCopy,
      });
      if (convertedMinus) {
        // tokensCopy.shift();
      } else {
        const convertMultiplication = convertMultiplications({
          token,
          nextToken: tokensCopy[0],
          parsedTokens,
          tokens: tokensCopy,
        });

        if (convertMultiplication) {
        } else {
          const foundUniqueOprator = findUniqueOperations({
            tokens: tokensCopy,
            token,
            parsedTokens,
          });

          if (!foundUniqueOprator) {
            parsedTokens.push(token);
          }
        }
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
