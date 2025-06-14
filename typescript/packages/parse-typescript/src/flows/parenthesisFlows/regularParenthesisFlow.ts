import { type TokenTypeOptions, TokenTypes } from "../../constants";
import { type BaseToken, type OpenedContext } from "../../types";
import { valueFlow } from "../valueFlows";
import { spaceFollowUpFlow } from "../genericFlows";

type RegularParenthesisFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  openedContexts: OpenedContext[];
};

export const regularParenthesisFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  openedContexts,
}: RegularParenthesisFlowArgs): {
  updatedIndex: number;
  stop: boolean;
} => {
  const startsWithParenthesis = newTokenValue === "(";

  if (startsWithParenthesis) {
    tokens.push({ type: TokenTypes.PARENTHESIS, value: newTokenValue });

    const { breakpoint, space } = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex,
      previousTokensSummary,
    });

    if (breakpoint.newTokenValue === "(") {
      const followup = regularParenthesisFlow({
        tokens,
        input,
        previousTokensSummary,
        openedContexts,
        ...breakpoint,
      });

      if (followup.stop) {
        return followup;
      }

      const follow = spaceFollowUpFlow({
        tokens,
        input,
        previousTokensSummary,
        currentIndex: followup.updatedIndex,
      });

      newTokenValue = follow.breakpoint.newTokenValue;
      currentIndex = follow.breakpoint.currentIndex;
    }
  }

  const value = valueFlow({
    tokens,
    newTokenValue,
    input,
    currentIndex,
    openedContexts,
    previousTokensSummary,
  });

  if ((!startsWithParenthesis && !value.addedNewToken) || value.stop) {
    return {
      updatedIndex: value.updatedIndex,
      stop: true,
    };
  }

  const { breakpoint, space } = spaceFollowUpFlow({
    tokens,
    input,
    previousTokensSummary,
    currentIndex: value.updatedIndex,
  });

  if (breakpoint.newTokenValue !== ")") {
    return {
      updatedIndex: space?.updatedIndex ?? value.updatedIndex,
      stop: true,
    };
  }

  tokens.push({ type: TokenTypes.PARENTHESIS, value: breakpoint.newTokenValue });

  return {
    updatedIndex: breakpoint.currentIndex,
    stop: false,
  };
};
