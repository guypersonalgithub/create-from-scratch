import { type TokenTypeOptions, TokenTypes } from "../../constants";
import { type BaseToken, type OpenedContext } from "../../types";
import { valueFlow } from "../valueFlows";
import { spaceFollowUpFlow } from "../genericFlows";
import { typeValueFlow } from "../typeFlows";
import { parenthesisFunctionEndFlow } from "./parenthesisFunctionEndFlow";
// import { regularParenthesisFlow } from "./regularParenthesisFlow"; // TODO: Check if this function is even necessary anymore.
import { canValueBeAnArgumentFlow } from "./canValueBeAnArgumentFlow";
import { functionAdditionalParamsFlow } from "./functionAdditionalParamsFlow";

type ParenthesisFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  openedContexts: OpenedContext[];
  isFromDefinitionFlow?: boolean;
  expectedToBeAFunction?: boolean;
  expectingArrow?: boolean;
};

type Return =
  | {
      updatedIndex: number;
      stop: boolean;
      hasArrow?: boolean;
    }
  | undefined;

export const parenthesisFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  openedContexts,
  isFromDefinitionFlow,
  expectedToBeAFunction,
  expectingArrow,
}: ParenthesisFlowArgs): Return => {
  if (newTokenValue !== "(") {
    return;
  }

  tokens.push({ type: TokenTypes.PARENTHESIS, value: newTokenValue });

  const { breakpoint, space } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });

  if (breakpoint.newTokenValue === "(") {
    const nestedParenthesis = parenthesisFlow({
      tokens,
      input,
      previousTokensSummary,
      openedContexts,
      expectedToBeAFunction,
      expectingArrow,
      ...breakpoint,
    });

    if (!nestedParenthesis) {
      return {
        updatedIndex: space?.updatedIndex ?? currentIndex,
        stop: true,
      };
    }

    if (nestedParenthesis.stop) {
      return nestedParenthesis;
    }

    const followup = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex: nestedParenthesis.updatedIndex,
      previousTokensSummary,
    });

    if (followup.breakpoint.newTokenValue !== ")") {
      return {
        updatedIndex: followup.space?.updatedIndex ?? nestedParenthesis.updatedIndex,
        stop: true,
      };
    }

    tokens.push({ type: TokenTypes.PARENTHESIS, value: followup.breakpoint.newTokenValue });

    return {
      updatedIndex: followup.breakpoint.currentIndex,
      stop: false,
      hasArrow: nestedParenthesis.hasArrow,
    };
  } else if (breakpoint.newTokenValue === ")") {
    // Empty parenthesis cannot be used other than an indication of a function.
    return parenthesisFunctionEndFlow({
      tokens,
      input,
      previousTokensSummary,
      openedContexts,
      isFromDefinitionFlow,
      expectedToBeAFunction,
      expectingArrow,
      canBeAnArgument: true,
      ...breakpoint,
    });
  }

  const amountOfTokens = tokens.length;
  const currentSavedIndex = breakpoint.currentIndex;
  const value = valueFlow({ tokens, input, previousTokensSummary, openedContexts, ...breakpoint });

  if (!value.addedNewToken || value.stop) {
    return {
      updatedIndex: value.updatedIndex,
      stop: true,
    };
  }

  if (
    value.addedAs ||
    value.addedAndOr ||
    value.addedTernary ||
    value.addedLowerHigherThan ||
    value.addedArithmetic ||
    value.addedEqualUnequal
  ) {
    if (expectedToBeAFunction) {
      return {
        updatedIndex: value.updatedIndex,
        stop: true,
      };
    }

    const { breakpoint, space } = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex: value.updatedIndex,
      previousTokensSummary,
    });

    if (breakpoint.newTokenValue !== ")") {
      return {
        updatedIndex: space?.updatedIndex ?? value.updatedIndex,
        stop: true,
      };
    }

    tokens.push({ type: TokenTypes.PARENTHESIS, value: breakpoint.newTokenValue });

    return {
      updatedIndex: breakpoint.currentIndex,
      stop: false,
    };
  }

  let hasOptionalArgument = false;
  let hasType = false;
  let next = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex: value.updatedIndex,
    previousTokensSummary,
  });

  const canBeAnArgument = canValueBeAnArgumentFlow({
    tokens,
    amountOfTokens,
    currentSavedIndex,
  });

  if (next.breakpoint.newTokenValue === "?") {
    if (!canBeAnArgument) {
      return {
        updatedIndex: next.space?.updatedIndex ?? value.updatedIndex,
        stop: true,
      };
    }

    tokens.push({ type: TokenTypes.OPERATOR, value: next.breakpoint.newTokenValue });
    hasOptionalArgument = true;
    const followup = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex: next.breakpoint.currentIndex,
      previousTokensSummary,
    });

    if (followup.breakpoint.newTokenValue !== ":") {
      return {
        updatedIndex: next.breakpoint.currentIndex,
        stop: true,
      };
    }

    next = followup;
  }

  let lastPassedIndex = value.updatedIndex;

  if (next.breakpoint.newTokenValue === ":") {
    if (!canBeAnArgument) {
      return {
        updatedIndex: next.space?.updatedIndex ?? value.updatedIndex,
        stop: true,
      };
    }

    tokens.push({ type: TokenTypes.TYPE_COLON, value: next.breakpoint.newTokenValue });
    hasType = true;

    const followup = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex: next.breakpoint.currentIndex,
      previousTokensSummary,
    });
    const potentialType = typeValueFlow({
      tokens,
      input,
      previousTokensSummary,
      ...followup.breakpoint,
    });

    if (!potentialType.addedNewToken || potentialType.stop) {
      return {
        updatedIndex: potentialType.updatedIndex,
        stop: true,
      };
    }

    lastPassedIndex = potentialType.updatedIndex;

    const follow = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex: lastPassedIndex,
      previousTokensSummary,
    });

    next = follow;
  }

  let hasComma = false;

  if (next.breakpoint.newTokenValue === ",") {
    if (!canBeAnArgument) {
      return {
        updatedIndex: next.space?.updatedIndex ?? lastPassedIndex,
        stop: true,
      };
    }

    hasComma = true;

    const endOfParams = functionAdditionalParamsFlow({
      tokens,
      input,
      previousTokensSummary,
      hasType,
      hasOptionalArgument,
      ...next.breakpoint,
    });

    if (endOfParams) {
      if (endOfParams.stop) {
        return endOfParams;
      }

      const beyond = spaceFollowUpFlow({
        tokens,
        input,
        currentIndex: endOfParams.updatedIndex,
        previousTokensSummary,
      });
      next = beyond;
    }
  }

  return parenthesisFunctionEndFlow({
    tokens,
    input,
    previousTokensSummary,
    openedContexts,
    isFromDefinitionFlow,
    expectedToBeAFunction,
    hasType,
    hasOptionalArgument,
    hasComma,
    lastIndex: next.space?.updatedIndex ?? lastPassedIndex,
    expectingArrow,
    canBeAnArgument,
    ...next.breakpoint,
  });
};
