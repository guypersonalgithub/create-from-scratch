import { TokenTypeOptions, TokenTypes } from "../../constants";
import { BaseToken } from "../../types";
import { invocationFlow, typedInvocationFlow } from "../invocationFlows";
import { spaceFollowUpFlow } from "../genericFlows";

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
  previousTokensSummary.push(TokenTypes.NEW);

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

  tokens.push({ type: TokenTypes.CLASS_NAME, value: breakpoint.newTokenValue });
  previousTokensSummary.push(TokenTypes.CLASS_NAME);

  const { breakpoint: followingBreakpoint } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex: breakpoint.currentIndex,
    previousTokensSummary,
  });

  const invocation =
    typedInvocationFlow({ tokens, input, previousTokensSummary, ...followingBreakpoint }) ||
    invocationFlow({
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
