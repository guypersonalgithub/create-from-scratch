import { TokenTypeOptions, TokenTypes } from "../constants";
import { BaseToken, OpenedContext } from "../types";
import { classFlow } from "./classFlow";
import { spaceFollowUpFlow } from "./spaceFlow";

type AbstractClassFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  openedContexts: OpenedContext[];
};

export const abstractClassFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  openedContexts,
}: AbstractClassFlowArgs) => {
  if (newTokenValue !== "abstract") {
    return;
  }

  tokens.push({ type: TokenTypes.ABSTRACT, value: newTokenValue });

  const { breakpoint, space } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });

  const potentialClassFlow = classFlow({
    tokens,
    input,
    previousTokensSummary,
    openedContexts,
    ...breakpoint,
  });

  if (!potentialClassFlow) {
    return {
      updatedIndex: space?.updatedIndex ?? currentIndex,
      stop: true,
    };
  }

  return potentialClassFlow;
};
