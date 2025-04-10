import { TokenTypeOptions, TokenTypes, valueArithmetics } from "../../constants";
import { BaseToken, OpenedContext } from "../../types";
import { spaceFollowUpFlow } from "../genericFlows";
import { valueFlow } from "./valueFlow";

type ArithmeticsValueFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  openedContexts: OpenedContext[];
};

export const arithmeticsValueFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  openedContexts,
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

  const followingValue = valueFlow({
    tokens,
    input,
    previousTokensSummary,
    openedContexts,
    ...breakpoint,
  });
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
