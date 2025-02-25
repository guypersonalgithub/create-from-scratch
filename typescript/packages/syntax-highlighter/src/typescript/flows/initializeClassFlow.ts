import { TokenTypeOptions, TokenTypes } from "../constants";
import { BaseToken } from "../types";
import { invocationFlow } from "./invocationFlow";
import { spaceFollowUpFlow } from "./spaceFlow";

type InitializeClassFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const initializeClassFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: InitializeClassFlowArgs) => {
  if (newTokenValue !== "new") {
    return;
  }

  tokens.push({ type: TokenTypes.NEW, value: newTokenValue });

  const { breakpoint, space } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });

  if (!breakpoint) {
    return (
      space || {
        updatedIndex: currentIndex,
        stop: false,
      }
    );
  }

  tokens.push({ type: TokenTypes.CLASS, value: breakpoint.newTokenValue });

  const { breakpoint: followingBreakpoint } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex: breakpoint.currentIndex,
    previousTokensSummary,
  });

  const invocation = invocationFlow({
    tokens,
    input,
    previousTokensSummary,
    ...followingBreakpoint,
  });

  if (!invocation) {
    return {
      updatedIndex: breakpoint.currentIndex,
      stop: false,
    };
  }

  return invocation;
};
