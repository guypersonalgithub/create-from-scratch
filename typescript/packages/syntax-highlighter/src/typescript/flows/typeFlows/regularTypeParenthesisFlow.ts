import { TokenTypeOptions, TokenTypes } from "../../constants";
import { BaseToken } from "../../types";
import { spaceFollowUpFlow } from "../spaceFlow";
import { typeValueFlow } from "./typeValueFlow";

type RegularTypeParenthesisFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  withinParenthesis?: boolean;
};

export const regularTypeParenthesisFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  withinParenthesis,
}: RegularTypeParenthesisFlowArgs):
  | {
      updatedIndex: number;
      stop: boolean;
    }
  | undefined => {
  if (newTokenValue === "(") {
    const { breakpoint, space } = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex,
      previousTokensSummary,
    });
    const followup = regularTypeParenthesisFlow({
      tokens,
      input,
      previousTokensSummary,
      ...breakpoint,
      withinParenthesis: true,
    });

    if (!followup) {
      return {
        updatedIndex: space?.updatedIndex ?? currentIndex,
        stop: true,
      };
    }

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

  const type = typeValueFlow({
    tokens,
    newTokenValue,
    input,
    currentIndex,
    previousTokensSummary,
  });

  if (!type.addedNewToken || type.stop) {
    return {
      updatedIndex: type.updatedIndex,
      stop: true,
    };
  }

  const { breakpoint, space } = spaceFollowUpFlow({
    tokens,
    input,
    previousTokensSummary,
    currentIndex: type.updatedIndex,
  });

  if (breakpoint.newTokenValue !== ")") {
    return {
      updatedIndex: space?.updatedIndex ?? type.updatedIndex,
      stop: true,
    };
  }

  tokens.push({ type: TokenTypes.TYPE_PARENTHESIS, value: breakpoint.newTokenValue });

  return {
    updatedIndex: breakpoint.currentIndex,
    stop: false,
  };
};
