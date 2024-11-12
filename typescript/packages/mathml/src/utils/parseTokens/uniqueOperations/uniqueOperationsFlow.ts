import { uniqueFunctions } from "@packages/math-parser";
import { ParsedToken } from "../types";
import { recursivelyParseFactorial } from "./recursivelyParseFactorial";
import { recursivelyParseFraction } from "./recursivelyParseFraction";
import { recursivelyParseUniqueFunction } from "./recursivelyParseFunction";
import { recursivelyParseLog } from "./recursivelyParseLog";
import { recursivelyParsePower } from "./recursivelyParsePower";
import { recursivelyParseSqrt } from "./recursivelyParseSqrt";

type UniqueOperationsFlowArgs = {
  tokens: ParsedToken[];
  token: ParsedToken;
  parsedTokens: ParsedToken[];
  isRoot?: boolean;
};

export const uniqueOperationsFlow = ({
  tokens,
  token,
  parsedTokens,
  isRoot,
}: UniqueOperationsFlowArgs) => {
  const { value } = token;

  if (value === "sqrt") {
    parsedTokens.push(recursivelyParseSqrt({ tokens }));
  } else if (value === "^") {
    parsedTokens.push(recursivelyParsePower({ tokens, parsedTokensOfTheSameLevel: parsedTokens }));
  } else if (value === "/") {
    parsedTokens.push(
      recursivelyParseFraction({ tokens, parsedTokensOfTheSameLevel: parsedTokens }),
    );
  } else if (value === "!") {
    parsedTokens.push(recursivelyParseFactorial({ parsedTokensOfTheSameLevel: parsedTokens }));
  } else if (value === "log") {
    const { changedPowerLocation, isRootLog, ...newToken } = recursivelyParseLog({
      tokens,
      isRoot,
    });
    parsedTokens.push(newToken);
    if (changedPowerLocation && isRootLog) {
      parsedTokens.shift();
      tokens.shift();
    }
  } else if (typeof value === "string" && uniqueFunctions.has(value)) {
    const { changedPowerLocation, isRootFunction, ...newToken } = recursivelyParseUniqueFunction({
      func: value,
      tokens,
      isRoot,
    });
    parsedTokens.push(newToken);
    if (changedPowerLocation && isRootFunction) {
      parsedTokens.shift();
      tokens.shift();
    }
  } else {
    parsedTokens.push(token);
  }
};
