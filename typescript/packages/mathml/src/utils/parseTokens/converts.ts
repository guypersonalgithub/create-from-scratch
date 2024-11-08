import { TokenTypes } from "@packages/math-parser";
import { ParsedToken } from "./types";
import { UniqueMathMLTokens } from "./constants";

type ConvertsArgs = {
  token: ParsedToken;
  nextToken: ParsedToken;
  parsedTokens: ParsedToken[];
  tokens: ParsedToken[];
};

export const convertMinuses = ({ token, nextToken, parsedTokens, tokens }: ConvertsArgs) => {
  if (token.value !== "-1" || nextToken?.value !== "*") {
    return false;
  }

  parsedTokens.push({
    type: TokenTypes.UNIQUE_TOKEN,
    value: "-",
  });
  tokens.shift();

  return true;
};

export const convertMultiplications = ({
  token,
  nextToken,
  parsedTokens,
}: Omit<ConvertsArgs, "tokens">) => {
  const lastToken = parsedTokens[parsedTokens.length - 1];
  if (
    token.value !== "*" ||
    nextToken.type === TokenTypes.VALUE ||
    nextToken.value === "(" ||
    lastToken.value === ")" ||
    lastToken.type === UniqueMathMLTokens.FACTORIAL
  ) {
    return false;
  }

  return true;
};
