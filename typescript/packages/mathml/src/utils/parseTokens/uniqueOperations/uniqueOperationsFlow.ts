import { uniqueFunctions } from "@packages/math-parser";
import { ParsedToken } from "~/utils/parseTokens/types";
import { recursivelyParseFactorial } from "~/utils/parseTokens/uniqueOperations/recursivelyParseFactorial";
import { recursivelyParseFraction } from "~/utils/parseTokens/uniqueOperations/recursivelyParseFraction";
import { recursivelyParseUniqueFunction } from "~/utils/parseTokens/uniqueOperations/recursivelyParseFunction";
import { recursivelyParseLog } from "~/utils/parseTokens/uniqueOperations/recursivelyParseLog";
import { recursivelyParsePower } from "~/utils/parseTokens/uniqueOperations/recursivelyParsePower";
import { recursivelyParseSqrt } from "~/utils/parseTokens/uniqueOperations/recursivelyParseSqrt";
import { recursivelyParseLimit } from "~/utils/parseTokens/uniqueOperations/recursivelyParseLimit";
import { recursivelyParseRoot } from "~/utils/parseTokens/uniqueOperations/recursivelyParseRoot";
import { recursivelyParseFloor } from "~/utils/parseTokens/uniqueOperations/recursivelyParseFloor";
import { recursivelyParseCancel } from "~/utils/parseTokens/uniqueOperations/recursivelyParseCancel";

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
  }
  if (value === "root") {
    parsedTokens.push(recursivelyParseRoot({ tokens }));
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
  } else if (value === "lim") {
    parsedTokens.push(recursivelyParseLimit({ tokens }));
  } else if (value === "floor") {
    parsedTokens.push(recursivelyParseFloor({ tokens }));
  } else if (value === "cancel") {
    parsedTokens.push(recursivelyParseCancel({ tokens }));
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
