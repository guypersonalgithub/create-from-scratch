import { TokenTypeOptions, TokenTypes } from "../constants";
import { BaseToken } from "../types";
import { findNextBreakpoint } from "../utils";
import { spaceFlow, spaceFollowUpFlow } from "./spaceFlow";
import { typeFlow } from "./typeFlow";

type ExtendsTypeFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const extendsTypeFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: ExtendsTypeFlowArgs):
  | {
      updatedIndex: number;
      stop: boolean;
    }
  | undefined => {
  if (newTokenValue !== "extends") {
    return;
  }

  tokens.push({ type: TokenTypes.EXTENDS, value: newTokenValue });

  const following = findNextBreakpoint({ input, currentIndex });
  const potentialSpace = spaceFlow({
    tokens,
    input,
    previousTokensSummary,
    ...following,
  });

  if (!potentialSpace) {
    return {
      updatedIndex: currentIndex,
      stop: true,
    };
  }

  const possibleType = typeFlow({
    tokens,
    input,
    currentIndex: potentialSpace.updatedIndex,
    previousTokensSummary,
  });

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

  const firstType = typeFlow({
    tokens,
    input,
    currentIndex: breakpoint.currentIndex,
    previousTokensSummary,
  });

  if (firstType.stop) {
    return firstType;
  }

  const { breakpoint: firstFollowUp } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex: firstType.updatedIndex,
    previousTokensSummary,
  });

  const potentialExtends = extendsTypeFlow({
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

  const secondType = typeFlow({
    tokens,
    input,
    currentIndex: followingBreakpoint.currentIndex,
    previousTokensSummary,
  });

  if (secondType.stop) {
    return secondType;
  }

  const { breakpoint: secondFollowUp } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex: secondType.updatedIndex,
    previousTokensSummary,
  });

  const potentialSecondExtends = extendsTypeFlow({
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
