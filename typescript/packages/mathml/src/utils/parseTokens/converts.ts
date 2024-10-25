import { ParsedToken } from "./types";

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
    type: "uniqueToken",
    value: "-",
  });
  tokens.shift();

  return true;
};

export const convertMultiplications = ({
  token,
  nextToken,
  parsedTokens,
  tokens,
}: ConvertsArgs) => {
  const lastToken = parsedTokens[parsedTokens.length - 1];
  if (
    token.value !== "*" ||
    nextToken.type === "value" ||
    nextToken.value === "(" ||
    lastToken.value === ")"
  ) {
    return false;
  }

  return true;
};
