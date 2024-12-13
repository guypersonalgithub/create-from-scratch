import { ParsedToken } from "../types";
import { recursivelyParsePower } from "./recursivelyParsePower";

type UniqueFunctionWithPowerArgs = {
  value: ParsedToken[];
  tokens: ParsedToken[];
};

export const uniqueFunctionWithPower = ({
  value,
  tokens,
}: UniqueFunctionWithPowerArgs): boolean => {
  if (tokens.length < 2 || tokens[0].value !== ")" || tokens[1].value !== "^") {
    return false;
  }

  let currentToken = tokens.shift();
  if (!currentToken) {
    throw new Error("Unexpected syntax!");
  }

  tokens.shift();
  const funcToken = value[0];
  const parsedPowerTokens = recursivelyParsePower({
    tokens,
    parsedTokensOfTheSameLevel: [funcToken],
    isRoot: false,
  });

  value.shift();
  value.unshift(parsedPowerTokens);
  tokens.unshift(currentToken);

  if (tokens.length >= 2 && tokens[0].value === ")" && tokens[1].value === "^") {
    return uniqueFunctionWithPower({ value, tokens });
  }

  return true;
};
