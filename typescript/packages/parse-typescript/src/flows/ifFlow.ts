import { type TokenTypeOptions, TokenTypes } from "../constants";
import { type BaseToken, type OpenedContext } from "../types";
import { spaceFollowUpFlow } from "./genericFlows";
import { nestedContextFlow } from "./nestedContextFlow";
import { valueFlow } from "./valueFlows";

type IfFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  openedContexts: OpenedContext[];
};

export const ifFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  openedContexts,
}: IfFlowArgs) => {
  if (newTokenValue !== "if") {
    return;
  }

  tokens.push({ type: TokenTypes.IF, value: newTokenValue });

  const { breakpoint, space } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });

  if (!space) {
    return {
      updatedIndex: currentIndex,
      stop: true,
    };
  }

  if (breakpoint.newTokenValue !== "(") {
    return {
      updatedIndex: currentIndex,
      stop: true,
    };
  }

  tokens.push({ type: TokenTypes.PARENTHESIS, value: breakpoint.newTokenValue });

  const { breakpoint: followup, space: spaceFollowup } = spaceFollowUpFlow({
    tokens,
    input,
    previousTokensSummary,
    currentIndex: breakpoint.currentIndex,
  });

  if (!followup) {
    return {
      updatedIndex: spaceFollowup?.updatedIndex ?? breakpoint.currentIndex,
      stop: true,
    };
  }

  const value = valueFlow({ tokens, input, previousTokensSummary, openedContexts, ...followup });
  if (!value.addedNewToken) {
    return {
      updatedIndex: spaceFollowup?.updatedIndex ?? breakpoint.currentIndex,
      stop: true,
    };
  }

  if (value.stop) {
    return {
      updatedIndex: value.updatedIndex,
      stop: true,
    };
  }

  const { breakpoint: followup2, space: spaceFollowup2 } = spaceFollowUpFlow({
    tokens,
    input,
    previousTokensSummary,
    currentIndex: value.updatedIndex,
  });

  if (!followup2) {
    return {
      updatedIndex: spaceFollowup2?.updatedIndex ?? value.updatedIndex,
      stop: true,
    };
  }

  tokens.push({ type: TokenTypes.PARENTHESIS, value: followup2.newTokenValue });

  const { breakpoint: followup3, space: spaceFollowup3 } = spaceFollowUpFlow({
    tokens,
    input,
    previousTokensSummary,
    currentIndex: followup2.currentIndex,
  });

  if (!followup3) {
    return {
      updatedIndex: spaceFollowup3?.updatedIndex ?? followup2.currentIndex,
      stop: true,
    };
  }

  if (followup3.newTokenValue !== "{") {
    const ifAction = valueFlow({
      tokens,
      input,
      previousTokensSummary,
      openedContexts,
      ...followup3,
    });
    if (ifAction.stop || !ifAction.addedNewToken) {
      return {
        updatedIndex: ifAction.updatedIndex,
        stop: true,
      };
    }

    return {
      updatedIndex: ifAction.updatedIndex,
      stop: false,
    };
  }

  tokens.push({ type: TokenTypes.IF_CURLY_BRACKET, value: followup3.newTokenValue });
  // TODO: Add an indication for already taken ifs names/numbers, in order
  // to avoid taking the same if name again and again, incase some sort of a context feature will be implemented later on.
  openedContexts.push({ name: "if", type: "if" });

  return nestedContextFlow({
    tokens,
    input,
    currentIndex: followup3.currentIndex,
    previousTokensSummary,
    openedContexts,
  });
};
