import { TokenTypeOptions, TokenTypes } from "../../constants";
import { BaseToken } from "../../types";
import { valueFlow } from "../valueFlows";
import { spaceFollowUpFlow } from "../genericFlows";

type RegularParenthesisFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const regularParenthesisFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
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

  const value = valueFlow({ tokens, newTokenValue, input, currentIndex, previousTokensSummary });

  if ((!startsWithParenthesis && !value.addedNewToken) || value.stop) {
    return {
      updatedIndex: value.updatedIndex,
      stop: true,
    };
  }

  let { breakpoint, space } = spaceFollowUpFlow({
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
