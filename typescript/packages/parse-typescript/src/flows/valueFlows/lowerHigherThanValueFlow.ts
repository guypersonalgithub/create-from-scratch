import { type TokenTypeOptions, TokenTypes } from "../../constants";
import { type BaseToken, type OpenedContext } from "../../types";
import { spaceFollowUpFlow } from "../genericFlows";
import { valueFlow } from "../valueFlows";

type LowerHigherThanValueFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  openedContexts: OpenedContext[];
};

export const lowerHigherThanValueFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  openedContexts,
}: LowerHigherThanValueFlowArgs) => {
  if (newTokenValue !== "<" && newTokenValue !== ">") {
    return;
  }

  let { breakpoint, space } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });

  const isLowerThan = newTokenValue === "<";

  if (breakpoint.newTokenValue === "=") {
    tokens.push({
      type: isLowerThan ? TokenTypes.LOWER_THAN_EQUAL : TokenTypes.HIGHER_THAN_EQUAL,
      value: `${newTokenValue}${breakpoint.newTokenValue}`,
    });

    const followup = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex: breakpoint.currentIndex,
      previousTokensSummary,
    });
    breakpoint = followup.breakpoint;
    space = followup.space;
  } else {
    tokens.push({
      type: isLowerThan ? TokenTypes.LOWER_THAN : TokenTypes.HIGHTER_THAN,
      value: newTokenValue,
    });
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
      updatedIndex: followingValue.updatedIndex,
      stop: true,
    };
  }

  return {
    updatedIndex: followingValue.updatedIndex,
    stop: false,
  };
};
