import { isStringOnlyWithLetters } from "@packages/utils";
import { type TokenTypeOptions, TokenTypes } from "../constants";
import { type BaseToken, type OpenedContext } from "../types";
import { findLastNonPreviousSpaceToken } from "../utils";
import { spaceFollowUpFlow } from "./genericFlows";
import { ambiguousTagFlow } from "./ambiguousFlows";
import { tagContentFlow } from "./tagContentFlow";
import { parenthesisFlow } from "./parenthesisFlows";
import { JSXFlow } from "./JSXFlow";

type AngleFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  openedContexts: OpenedContext[];
  isFromDefinitionFlow?: boolean;
  expectingArrow?: boolean;
  isExpectedToBeType?: boolean;
};

type AngleFlowReturnType =
  | {
      isFunction?: boolean;
      updatedIndex: number;
      stop: boolean;
      hasArrow?: boolean;
    }
  | undefined;

export const angleFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  openedContexts,
  isFromDefinitionFlow,
  expectingArrow,
  isExpectedToBeType,
}: AngleFlowArgs): AngleFlowReturnType => {
  if (newTokenValue !== "<") {
    return;
  }

  const followingChar = input[currentIndex + 1];
  if (followingChar === "=") {
    tokens.push({ type: TokenTypes.OPERATOR, value: `${newTokenValue}${followingChar}` });
    previousTokensSummary.push(TokenTypes.OPERATOR);

    return {
      updatedIndex: currentIndex + 1,
      stop: false,
    };
  }

  tokens.push({ type: TokenTypes.ANGLE, value: newTokenValue });

  const lastNonPreviousSpaceToken = findLastNonPreviousSpaceToken({ previousTokensSummary });
  const isMathRelated =
    lastNonPreviousSpaceToken === TokenTypes.VARIABLE ||
    lastNonPreviousSpaceToken === TokenTypes.INVOKED_FUNCTION ||
    lastNonPreviousSpaceToken === TokenTypes.NUMBER;
  if (isMathRelated) {
    return {
      updatedIndex: currentIndex,
      stop: false,
    };
  }

  let isAngleType = false;
  let propertyIndex: number | undefined = undefined;

  const { breakpoint } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });

  if (
    isStringOnlyWithLetters({ str: breakpoint.newTokenValue }) ||
    breakpoint.newTokenValue[0] === "_"
  ) {
    tokens.push({ type: TokenTypes.JSX, value: breakpoint.newTokenValue });
    propertyIndex = tokens.length - 1;

    const {
      updatedIndex,
      stop,
      isType = false,
      isJSX,
    } = ambiguousTagFlow({
      tokens,
      input,
      currentIndex: breakpoint.currentIndex,
      previousTokensSummary,
      openedContexts,
      propertyIndex,
      isExpectedToBeType,
    });

    if (stop) {
      return {
        updatedIndex,
        stop,
      };
    }

    if (isJSX) {
      return {
        updatedIndex,
        stop: false,
      };
    }

    currentIndex = updatedIndex;
    isAngleType = isType;
  } else if (breakpoint.newTokenValue === ">") {
    // tagFlow
  } else {
    return {
      updatedIndex: currentIndex - 1,
      stop: true,
    };
  }

  const { breakpoint: nextBreakpoint } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });

  if (nextBreakpoint.newTokenValue !== ">") {
    if (isExpectedToBeType) {
      return {
        updatedIndex: currentIndex,
        stop: true,
      };
    }

    const jsxFlow = JSXFlow({ tokens, input, currentIndex, openedContexts, previousTokensSummary }); // Consider some optimization
    if (jsxFlow.stop) {
      return {
        updatedIndex: currentIndex,
        stop: true,
      };
    }

    return jsxFlow;
  }

  tokens.push({ type: TokenTypes.ANGLE, value: nextBreakpoint.newTokenValue });

  if (isExpectedToBeType) {
    isAngleType = true;
  }

  if (!isAngleType) {
    const tokensAmount = tokens.length;

    const { breakpoint: followUp } = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex: nextBreakpoint.currentIndex,
      previousTokensSummary,
    });

    const parenthesis = parenthesisFlow({
      tokens,
      input,
      previousTokensSummary,
      openedContexts,
      isFromDefinitionFlow,
      expectedToBeAFunction: true,
      expectingArrow,
      ...followUp,
    });

    if (parenthesis && !parenthesis.stop && parenthesis.hasArrow) {
      if (propertyIndex !== undefined) {
        tokens[propertyIndex].type = TokenTypes.TYPE;
      }

      return parenthesis;
    }

    tokens = tokens.slice(0, tokensAmount);

    const {
      updatedIndex,
      stop,
      isType = false,
    } = tagContentFlow({
      tokens,
      input,
      currentIndex: nextBreakpoint.currentIndex,
      previousTokensSummary,
    });

    if (!isType) {
      return {
        updatedIndex,
        stop,
      };
    }

    isAngleType = isType;
  }

  const { breakpoint: followUp } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex: nextBreakpoint.currentIndex,
    previousTokensSummary,
  });

  const parenthesis = parenthesisFlow({
    tokens,
    input,
    previousTokensSummary,
    openedContexts,
    isFromDefinitionFlow,
    expectedToBeAFunction: true,
    expectingArrow,
    ...followUp,
  });

  if (!parenthesis) {
    return {
      updatedIndex: nextBreakpoint.currentIndex,
      stop: false,
    };
  }

  if (parenthesis.stop || (expectingArrow && !parenthesis.hasArrow)) {
    return {
      updatedIndex: parenthesis.updatedIndex,
      stop: true,
    };
  }

  if (propertyIndex !== undefined) {
    tokens[propertyIndex].type = TokenTypes.TYPE;
  }

  return { ...parenthesis, hasArrow: true };
};
