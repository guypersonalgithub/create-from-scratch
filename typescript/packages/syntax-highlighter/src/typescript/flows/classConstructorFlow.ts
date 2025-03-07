import { TokenTypeOptions, TokenTypes } from "../constants";
import { BaseToken, OpenedContext } from "../types";
import { parenthesisFlow } from "./parenthesisFlow";
import { spaceFollowUpFlow } from "./spaceFlow";

type ClassConstructorFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  openedContexts: OpenedContext[];
};

export const classConstructorFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  openedContexts,
}: ClassConstructorFlowArgs) => {
  if (newTokenValue !== "constructor") {
    return;
  }

  if (openedContexts[openedContexts.length - 1].type !== "class") {
    return {
      updatedIndex: currentIndex - newTokenValue.length,
      stop: true,
    };
  }

  tokens.push({ type: TokenTypes.CLASS_CONSTRUCTOR, value: newTokenValue });

  const { breakpoint, space } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });

  if (!breakpoint) {
    return {
      updatedIndex: space?.updatedIndex ?? currentIndex,
      stop: true,
    };
  }

  return parenthesisFlow({
    tokens,
    input,
    previousTokensSummary,
    openedContexts,
    expectingFunction: true,
    ...breakpoint,
  });
};
