import { TokenTypeOptions, TokenTypes } from "../../constants";
import { BaseToken } from "../../types";
import { findNextBreakpoint, iterateOverSteps, spaceCallback, StepCallback } from "../../utils";
import { asFlow } from "../typeFlows";
import { valueFlow } from "../valueFlow";

type InvocationFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const invocationFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: InvocationFlowArgs) => {
  if (
    newTokenValue !== "(" ||
    (previousTokensSummary[previousTokensSummary.length - 1] !== TokenTypes.VARIABLE &&
      previousTokensSummary[previousTokensSummary.length - 1] !== TokenTypes.CLASS_NAME)
  ) {
    return;
  }

  tokens.push({ type: TokenTypes.PARENTHESIS, value: newTokenValue });

  const stepCallbacks: StepCallback[] = [
    spaceCallback({ tokens, input, stop: false, previousTokensSummary }),
    {
      callback: ({ currentIndex, newTokenValue }) => {
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

        return {
          updatedIndex: value.updatedIndex,
          stop: false,
        };
      },
      stop: true,
    },
    spaceCallback({ tokens, input, stop: false, previousTokensSummary }),
    {
      callback: ({ currentIndex, newTokenValue }) => {
        const as = asFlow({ tokens, newTokenValue, input, currentIndex, previousTokensSummary });
        if (!as) {
          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: false,
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
        };
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

  let shouldStop = false;
  while (currentIndex < input.length) {
    const { updatedIndex, stop, exit } = iterateOverSteps({
      input,
      currentIndex,
      stepCallbacks,
    });
    currentIndex = updatedIndex;

    if (exit) {
      break;
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

  return {
    updatedIndex: expectedParenthesisEnd.currentIndex,
    stop: false,
  };
};
