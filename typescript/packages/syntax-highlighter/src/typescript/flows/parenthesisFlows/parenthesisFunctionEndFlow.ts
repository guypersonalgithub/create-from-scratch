import { TokenTypeOptions, TokenTypes } from "../../constants";
import { BaseToken, OpenedContext } from "../../types";
import { valueFlow } from "../valueFlows";
import { arrowFlow } from "../functionFlows";
import { spaceFollowUpFlow } from "../genericFlows";
import { functionReturnTypeFlow } from "../typeFlows/functionReturnTypeFlow";

type ParenthesisFunctionEndFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  openedContexts: OpenedContext[];
  isFromDefinitionFlow?: boolean;
  expectedToBeAFunction?: boolean;
  hasType?: boolean;
  hasOptionalArgument?: boolean;
  hasComma?: boolean;
  lastIndex?: number;
  expectingArrow?: boolean;
  canBeAnArgument: boolean;
};

type Return = {
  updatedIndex: number;
  stop: boolean;
  hasArrow?: boolean;
};

export const parenthesisFunctionEndFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  openedContexts,
  isFromDefinitionFlow,
  expectedToBeAFunction,
  hasType,
  hasOptionalArgument,
  hasComma,
  lastIndex,
  expectingArrow,
  canBeAnArgument,
}: ParenthesisFunctionEndFlowArgs): Return => {
  if (newTokenValue !== ")") {
    return {
      updatedIndex: lastIndex ?? currentIndex,
      stop: true,
    };
  }

  tokens.push({ type: TokenTypes.PARENTHESIS, value: newTokenValue });

  let nextInLine = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });

  let hasFunctionReturnType = false;
  if (nextInLine.breakpoint.newTokenValue === ":") {
    if (!expectedToBeAFunction || !canBeAnArgument) {
      return {
        updatedIndex: nextInLine.space?.updatedIndex ?? currentIndex,
        stop: true,
      };
    }

    tokens.push({ type: TokenTypes.TYPE_COLON, value: nextInLine.breakpoint.newTokenValue });

    hasFunctionReturnType = true;

    const following = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex: nextInLine.breakpoint.currentIndex,
      previousTokensSummary,
    });

    const potentialType = functionReturnTypeFlow({
      tokens,
      input,
      previousTokensSummary,
      ...following.breakpoint,
    });

    if (potentialType.stop) {
      return {
        updatedIndex: potentialType.updatedIndex,
        stop: true,
      };
    }

    const followup = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex: potentialType.updatedIndex,
      previousTokensSummary,
    });

    nextInLine = followup;
  }

  let hasArrow = false;

  if (expectingArrow && canBeAnArgument) {
    const isExpectedToBeAFunction =
      hasType || hasOptionalArgument || hasComma || hasFunctionReturnType;

    const potentialArrow = arrowFlow({
      tokens,
      input,
      previousTokensSummary,
      ...nextInLine.breakpoint,
    });

    if (!potentialArrow) {
      const stop = expectedToBeAFunction || isExpectedToBeAFunction;

      return {
        updatedIndex: nextInLine.space?.updatedIndex ?? currentIndex,
        stop,
      };
    }

    if (potentialArrow.stop) {
      return potentialArrow;
    }

    hasArrow = true;

    const following = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex: potentialArrow.updatedIndex,
      previousTokensSummary,
    });

    nextInLine = following;
  }

  if (nextInLine.breakpoint.newTokenValue !== "{") {
    const returnValue = valueFlow({
      tokens,
      input,
      previousTokensSummary,
      ...nextInLine.breakpoint,
    });

    if (!returnValue.addedNewToken || returnValue.stop) {
      return {
        updatedIndex: returnValue.updatedIndex,
        stop: true,
      };
    }

    return {
      updatedIndex: returnValue.updatedIndex,
      stop: false,
    };
  }

  tokens.push({
    type: TokenTypes.FUNCTION_CURLY_BRACKET,
    value: nextInLine.breakpoint.newTokenValue,
  });

  if (!isFromDefinitionFlow) {
    // TODO: Add an indication for already taken anonymous function names/numbers, in order
    // to avoid taking the same "anonymous" name again and again, incase some sort of a context feature will be implemented later on.
    openedContexts.push({ name: "anonymous", type: "function" });
  }

  return {
    updatedIndex: nextInLine.breakpoint.currentIndex,
    stop: false,
    hasArrow,
  };
};
