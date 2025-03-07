import { isStringOnlyWithLetters } from "@packages/utils";
import { TokenTypeOptions, TokenTypes } from "../constants";
import { BaseToken } from "../types";
import { spaceFlow, spaceFollowUpFlow } from "./spaceFlow";
import { extendsTypeFlow } from "./extendsTypeFlow";
import { findNextBreakpoint } from "../utils";

type GenericTypeValueFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const genericTypeValueFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: GenericTypeValueFlowArgs) => {
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
    !isStringOnlyWithLetters({ str: breakpoint.newTokenValue }) &&
    breakpoint.newTokenValue[0] !== "_"
  ) {
    return {
      updatedIndex: space?.updatedIndex ?? currentIndex,
      stop: true,
    };
  }

  tokens.push({ type: TokenTypes.TYPE, value: breakpoint.newTokenValue });

  const { breakpoint: followUp, space: followUpSpace } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex: breakpoint.currentIndex,
    previousTokensSummary,
  });

  const possibleExtends = extendsTypeFlow({ tokens, input, previousTokensSummary, ...followUp });

  if (!possibleExtends) {
    if (followUp.newTokenValue !== ">") {
      return {
        updatedIndex: followUpSpace?.updatedIndex ?? breakpoint.currentIndex,
        stop: true,
      };
    }

    tokens.push({ type: TokenTypes.ANGLE, value: followUp.newTokenValue });

    const following = findNextBreakpoint({ input, currentIndex: followUp.currentIndex });
    const potentialSpace = spaceFlow({ tokens, input, previousTokensSummary, ...following });

    return {
      updatedIndex: potentialSpace?.updatedIndex ?? followUp.currentIndex,
      stop: false,
    };
  }

  const { breakpoint: followUp2, space: followUpSpace2 } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex: possibleExtends.updatedIndex,
    previousTokensSummary,
  });

  if (followUp2.newTokenValue !== ">") {
    return {
      updatedIndex: followUpSpace2?.updatedIndex ?? possibleExtends.updatedIndex,
      stop: true,
    };
  }

  tokens.push({ type: TokenTypes.ANGLE, value: followUp2.newTokenValue });

  return {
    updatedIndex: followUp2.currentIndex,
    stop: false,
  };
};
