import { TokenTypeOptions, TokenTypes } from "../constants";
import { BaseToken } from "../types";
import { asFlow } from "./asFlow";
import { iterateOverSteps, spaceCallback, StepCallback, findNextBreakpoint } from "../utils";
import { typeFlow } from "./typeFlow";
import { valueFlow } from "./valueFlow";
import { arrowFlow } from "./arrowFlow";
import { spaceFollowUpFlow } from "./spaceFlow";

type ParenthesisFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  openedFunctions: string[];
  isFromDefinitionFlow?: boolean;
  // context: Context;
  // currentLayeredContexts: CurrentLayeredContexts;
} & ExpectingFunction;

type ExpectingFunction =
  | {
      expectingFunction?: true;
      expectingArrow?: boolean;
    }
  | {
      expectingFunction?: false;
      expectingArrow?: never;
    }
  | {
      expectingFunction?: never;
      expectingArrow?: never;
    };

type SharedStageData = {
  hasComma?: boolean;
  hasString?: boolean;
  hasBoolean?: boolean;
  hasAs?: boolean;
};

export const parenthesisFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  openedFunctions,
  isFromDefinitionFlow,
  expectingFunction,
  expectingArrow,
  // context,
  // currentLayeredContexts,
}: ParenthesisFlowArgs) => {
  if (newTokenValue !== "(") {
    return;
  }

  tokens.push({ type: TokenTypes.PARENTHESIS, value: newTokenValue });

  // no function - html tag div before the parenthesis, string value, type casting.
  // potential function - commas, multiple values, colon types, potential colon type after the end of the parenthesis for return type, requires arrow function.

  const stepCallbacks: StepCallback<SharedStageData>[] = [
    spaceCallback({ tokens, input, stop: false, previousTokensSummary }),
    {
      callback: ({ currentIndex, newTokenValue }, sharedData) => {
        const value = valueFlow({
          tokens,
          input,
          newTokenValue,
          currentIndex,
          previousTokensSummary,
          // context,
          // currentLayeredContexts,
        });

        if (!value.addedNewToken) {
          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: input[value.updatedIndex] !== ")",
          };
        }

        const lastToken = tokens.length - 1;
        const lastTokenIsString = tokens[lastToken].type === TokenTypes.STRING;
        const lastTokenIsBoolean = tokens[lastToken].type === TokenTypes.BOOLEAN;
        const shouldStop = (lastTokenIsString || lastTokenIsBoolean) && !!sharedData?.hasComma;

        return {
          updatedIndex: value.updatedIndex,
          stop: shouldStop,
          hasString: lastTokenIsString,
          hasBoolean: lastTokenIsBoolean,
        };
      },
      stop: true,
    },
    spaceCallback({ tokens, input, stop: false, previousTokensSummary }),
    {
      callback: ({ currentIndex, newTokenValue }, sharedData) => {
        if (sharedData?.hasComma) {
          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: false,
          };
        }

        const as = asFlow({ tokens, newTokenValue, input, currentIndex, previousTokensSummary });
        if (!as) {
          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: false,
            exit: !!sharedData?.hasString || !!sharedData?.hasBoolean,
          };
        }

        if (as.stop) {
          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: true,
          };
        }

        return {
          updatedIndex: as.updatedIndex,
          stop: false,
          exit: true,
          hasAs: true,
        };
      },
      stop: true,
    },
    spaceCallback({ tokens, input, stop: false, previousTokensSummary }),
    {
      callback: ({ currentIndex, newTokenValue }) => {
        if (newTokenValue !== ":") {
          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: false,
          };
        }

        tokens.push({ type: TokenTypes.TYPE_COLON, value: newTokenValue });
        previousTokensSummary.push(TokenTypes.TYPE_COLON);

        return typeFlow({
          tokens,
          input,
          currentIndex,
          previousTokensSummary,
        });
      },
      stop: true,
    },
    spaceCallback({ tokens, input, stop: false, previousTokensSummary }),
    {
      callback: ({ currentIndex, newTokenValue }) => {
        if (newTokenValue !== ",") {
          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: false,
            exit: true,
          };
        }

        tokens.push({ type: TokenTypes.COMMA, value: newTokenValue });
        previousTokensSummary.push(TokenTypes.COMMA);

        return {
          updatedIndex: currentIndex,
          stop: false,
          hasComma: true,
        };
      },
      stop: false,
    },
  ];

  if (expectingFunction) {
    stepCallbacks.splice(3, 2);
  }

  let shouldStop = false;
  let previousSharedData: SharedStageData = {};
  let isntExpectedToBeFunction = !expectingFunction || false;

  while (currentIndex < input.length) {
    const { updatedIndex, stop, exit, sharedData, i } = iterateOverSteps({
      input,
      currentIndex,
      stepCallbacks,
      previousSharedData,
    });
    currentIndex = updatedIndex;

    if (exit) {
      if (expectingFunction === undefined) {
        isntExpectedToBeFunction =
          !!sharedData.hasAs || !!sharedData.hasString || !!sharedData.hasBoolean;
      }
      break;
    }

    if (sharedData) {
      previousSharedData = sharedData;
    }

    if (stop) {
      shouldStop = true;
      break;
    }
  }

  if (shouldStop) {
    return {
      updatedIndex: currentIndex,
      stop: shouldStop,
    };
  }

  const expectedParenthesisEnd = findNextBreakpoint({ input, currentIndex });

  if (expectedParenthesisEnd.newTokenValue !== ")") {
    return {
      updatedIndex: currentIndex,
      stop: true,
    };
  }

  tokens.push({ type: TokenTypes.PARENTHESIS, value: expectedParenthesisEnd.newTokenValue });

  if (isntExpectedToBeFunction) {
    return {
      updatedIndex: expectedParenthesisEnd.currentIndex,
      stop: false,
    };
  }

  const { breakpoint: potentialColon } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex: expectedParenthesisEnd.currentIndex,
    previousTokensSummary,
  });

  let followingIndex = potentialColon.currentIndex - potentialColon.newTokenValue.length;
  if (potentialColon.newTokenValue === ":") {
    tokens.push({ type: TokenTypes.TYPE_COLON, value: potentialColon.newTokenValue });
    previousTokensSummary.push(TokenTypes.TYPE_COLON);

    const { updatedIndex, stop } = typeFlow({
      tokens,
      input,
      currentIndex: potentialColon.currentIndex,
      previousTokensSummary,
    });

    if (stop) {
      return {
        updatedIndex: potentialColon.currentIndex,
        stop: true,
      };
    }

    followingIndex = updatedIndex;
  }

  let followingBreakpoint: ReturnType<typeof findNextBreakpoint> & { stop?: boolean } =
    findNextBreakpoint({ input, currentIndex: followingIndex });

  if (expectingArrow) {
    const arrow = arrowFlow({ ...followingBreakpoint, tokens, input, previousTokensSummary });

    if (!arrow) {
      return {
        updatedIndex: followingIndex,
        stop: true,
        hasArrow: false,
      };
    }

    followingBreakpoint.currentIndex = arrow.updatedIndex;
    followingBreakpoint.stop = arrow.stop;
  } else {
    if (followingBreakpoint.newTokenValue === "{") {
      tokens.push({
        type: TokenTypes.FUNCTION_CURLY_BRACKET,
        value: followingBreakpoint.newTokenValue,
      });

      if (!isFromDefinitionFlow) {
        // TODO: Add an indication for already taken anonymous function names/numbers, in order
        // to avoid taking the same "anonymous" name again and again, incase some sort of a context feature will be implemented later on.
        openedFunctions.push("anonymous");
      }

      return {
        updatedIndex: followingBreakpoint.currentIndex,
        stop: false,
        hasArrow: false,
      };
    }
  }

  const { breakpoint } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex: followingBreakpoint.currentIndex,
    previousTokensSummary,
  });

  if (breakpoint.newTokenValue === "{") {
    tokens.push({ type: TokenTypes.FUNCTION_CURLY_BRACKET, value: breakpoint.newTokenValue });

    if (!isFromDefinitionFlow) {
      // TODO: Add an indication for already taken anonymous function names/numbers, in order
      // to avoid taking the same "anonymous" name again and again, incase some sort of a context feature will be implemented later on.
      openedFunctions.push("anonymous");
    }

    return {
      updatedIndex: breakpoint.currentIndex,
      stop: false,
      hasArrow: true,
    };
  }

  return {
    updatedIndex: followingBreakpoint.currentIndex,
    stop: followingBreakpoint?.stop ?? false,
    hasArrow: true,
  };
};
