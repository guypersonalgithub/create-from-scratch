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
};

export const uniqueOperationsFlow = ({ tokens, token, parsedTokens }: UniqueOperationsFlowArgs) => {
  const { type, value } = token;

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
    parsedTokens.push(recursivelyParseLog({ tokens }));
  } else if (typeof value === "string" && uniqueFunctions.has(value)) {
    parsedTokens.push(recursivelyParseUniqueFunction({ func: value, tokens }));
  } else {
    parsedTokens.push(token);
  }
};
