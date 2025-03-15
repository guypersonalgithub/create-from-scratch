import { TokenTypeOptions, TokenTypes } from "../../constants";
import { BaseToken } from "../../types";
import { spaceFollowUpFlow } from "../genericFlows";
import { typeValueFlow } from "./typeValueFlow";

type GenericTypeEqualFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const genericTypeEqualFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: GenericTypeEqualFlowArgs) => {
  if (newTokenValue !== "=") {
    return;
  }

  tokens.push({ type: TokenTypes.EQUAL, value: newTokenValue });

  const { breakpoint, space } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });

  const valueTokens = typeValueFlow({
    tokens,
    input,
    previousTokensSummary,
    ...breakpoint,
  });

  if (valueTokens.stop) {
    return {
      updatedIndex: valueTokens.updatedIndex,
      stop: true,
    };
  }

  if (!valueTokens.addedNewToken) {
    return {
      updatedIndex: space?.updatedIndex ?? breakpoint.currentIndex,
      stop: true,
    };
  }

  return {
    updatedIndex: valueTokens.updatedIndex,
    stop: false,
  };
};
