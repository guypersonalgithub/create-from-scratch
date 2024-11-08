import { convertMinuses, convertMultiplications } from "./converts";
import { ParsedToken } from "./types";
import { findUniqueOperations } from "./uniqueOperations";

type PushParsedTokensArgs = {
  tokens: ParsedToken[];
  parsedTokens: ParsedToken[];
};

export const pushParsedTokens = ({ tokens, parsedTokens }: PushParsedTokensArgs) => {
  const token = tokens.shift();

  if (!token) {
    throw new Error("Unexpected syntax!");
  }

  const convertedMinus = convertMinuses({
    token,
    nextToken: tokens[0],
    parsedTokens,
    tokens,
  });
  if (convertedMinus) {
    // tokens.shift();
  } else {
    const convertMultiplication = convertMultiplications({
      token,
      nextToken: tokens[0],
      parsedTokens,
    });

    if (convertMultiplication) {
    } else {
      const foundUniqueOprator = findUniqueOperations({
        tokens,
        token,
        parsedTokens,
      });

      if (!foundUniqueOprator) {
        parsedTokens.push(token);
      }
    }
  }
};
