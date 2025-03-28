import { TokenTypeOptions, TokenTypes, valueArithmetics } from "../../constants";
import { BaseToken } from "../../types";
import { spaceFollowUpFlow } from "../genericFlows";
import { valueFlow } from "./valueFlow";

type ArithmeticsValueFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const arithmeticsValueFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: ArithmeticsValueFlowArgs) => {
  if (!valueArithmetics.has(newTokenValue)) {
    return;
  }

  tokens.push({ type: TokenTypes.ARITHMETIC_OPERATOR, value: newTokenValue });

  let { breakpoint, space } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });

  if (breakpoint.newTokenValue === "=") {
    tokens.push({ type: TokenTypes.EQUAL, value: breakpoint.newTokenValue });

    const followup = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex: breakpoint.currentIndex,
      previousTokensSummary,
    });

    breakpoint = followup.breakpoint;
    space = followup.space;
  }

  const followingValue = valueFlow({ tokens, input, previousTokensSummary, ...breakpoint });
  if (!followingValue.addedNewToken || followingValue.stop) {
    return {
      updatedIndex: breakpoint.currentIndex,
      stop: true,
    };
  }

  return {
    updatedIndex: breakpoint.currentIndex,
    stop: false,
  };
};
