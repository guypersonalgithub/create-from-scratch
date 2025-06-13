import { type TokenTypeOptions, TokenTypes } from "../../constants";
import { type BaseToken } from "../../types";
import { spaceFollowUpFlow } from "../genericFlows";
import { typeValueFlow } from "./typeValueFlow";

type ExtendsTernaryOperatorTypeFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const extendsTernaryOperatorTypeFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: ExtendsTernaryOperatorTypeFlowArgs):
  | {
      updatedIndex: number;
      stop: boolean;
    }
  | undefined => {
  if (newTokenValue !== "extends") {
    return;
  }

  tokens.push({ type: TokenTypes.EXTENDS, value: newTokenValue });

  const followup = spaceFollowUpFlow({ tokens, input, currentIndex, previousTokensSummary });

  if (!followup.space) {
    return {
      updatedIndex: currentIndex,
      stop: true,
    };
  }

  const possibleType = typeValueFlow({
    tokens,
    input,
    previousTokensSummary,
    ...followup.breakpoint,
  });

  if (!possibleType) {
    return {
      updatedIndex: followup.space.updatedIndex,
      stop: true,
    };
  }

  if (possibleType.stop) {
    return possibleType;
  }

  const { breakpoint, space } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex: possibleType.updatedIndex,
    previousTokensSummary,
  });

  if (breakpoint.newTokenValue !== "?") {
    return {
      updatedIndex: space?.updatedIndex ?? possibleType.updatedIndex,
      stop: true,
    };
  }

  tokens.push({ type: TokenTypes.OPERATOR, value: breakpoint.newTokenValue });

  const { breakpoint: breakpoint2, space: space2 } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex: breakpoint.currentIndex,
    previousTokensSummary,
  });

  const firstType = typeValueFlow({
    tokens,
    input,
    previousTokensSummary,
    ...breakpoint2,
  });

  if (!firstType) {
    return {
      updatedIndex: space2?.updatedIndex ?? breakpoint.currentIndex,
      stop: true,
    };
  }

  if (firstType.stop) {
    return firstType;
  }

  const { breakpoint: firstFollowUp } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex: firstType.updatedIndex,
    previousTokensSummary,
  });

  const potentialExtends = extendsTernaryOperatorTypeFlow({
    tokens,
    input,
    previousTokensSummary,
    ...firstFollowUp,
  });

  let followingBreakpoint = firstFollowUp;

  if (potentialExtends) {
    const { breakpoint } = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex: potentialExtends.updatedIndex,
      previousTokensSummary,
    });

    followingBreakpoint = breakpoint;
  }

  if (followingBreakpoint.newTokenValue !== ":") {
    return {
      updatedIndex: followingBreakpoint.currentIndex,
      stop: true,
    };
  }

  tokens.push({ type: TokenTypes.OPERATOR, value: followingBreakpoint.newTokenValue });

  const next = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex: followingBreakpoint.currentIndex,
    previousTokensSummary,
  });

  const secondType = typeValueFlow({
    tokens,
    input,
    previousTokensSummary,
    ...next.breakpoint,
  });

  if (!secondType) {
    return {
      updatedIndex: next.space?.updatedIndex ?? followingBreakpoint.currentIndex,
      stop: true,
    };
  }

  if (secondType.stop) {
    return secondType;
  }

  const { breakpoint: secondFollowUp } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex: secondType.updatedIndex,
    previousTokensSummary,
  });

  const potentialSecondExtends = extendsTernaryOperatorTypeFlow({
    tokens,
    input,
    previousTokensSummary,
    ...secondFollowUp,
  });

  if (!potentialSecondExtends) {
    return secondType;
  }

  return potentialSecondExtends;
};
