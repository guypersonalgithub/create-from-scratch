import { isStringOnlyWithLetters } from "@packages/utils";
import { TokenTypeOptions, TokenTypes } from "../constants";
import { BaseToken } from "../types";
import { genericTypeFlow } from "./genericTypeFlow";
import { spaceFollowUpFlow } from "./spaceFlow";

type GenericTypeTemplateFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const genericTypeTemplateFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: GenericTypeTemplateFlowArgs) => {
  if (newTokenValue !== "<") {
    return;
  }

  tokens.push({ type: TokenTypes.ANGLE, value: newTokenValue });

  const { breakpoint, space } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });

  if (
    isStringOnlyWithLetters({ str: breakpoint.newTokenValue }) ||
    breakpoint.newTokenValue[0] === "_"
  ) {
    tokens.push({ type: TokenTypes.TYPE, value: breakpoint.newTokenValue });

    const { updatedIndex, stop, isJSX } = genericTypeFlow({
      tokens,
      input,
      currentIndex: breakpoint.currentIndex,
      previousTokensSummary,
      isExpectedToBeType: true,
    });

    if (stop) {
      return {
        updatedIndex,
        stop,
      };
    }

    if (isJSX) {
      return {
        updatedIndex,
        stop: true,
      };
    }

    currentIndex = updatedIndex;
  }

  const { breakpoint: nextBreakpoint } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });

  tokens.push({ type: TokenTypes.ANGLE, value: nextBreakpoint.newTokenValue });

  return {
    updatedIndex: nextBreakpoint.currentIndex,
    stop: false,
  };
};
