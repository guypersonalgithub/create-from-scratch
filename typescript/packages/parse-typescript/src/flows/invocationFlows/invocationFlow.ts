import { type TokenTypeOptions, TokenTypes } from "../../constants";
import { type BaseToken, type OpenedContext } from "../../types";
import {
  findNextBreakpoint,
  iterateOverSteps,
  spaceCallback,
  type StepCallback,
} from "../../utils";
import { spaceFollowUpFlow } from "../genericFlows";
import { asFlow } from "../typeFlows";
import { valueFlow } from "../valueFlows";
import { typedInvocationFlow } from "./typedInvocationFlow";

type InvocationFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  openedContexts: OpenedContext[];
  isFromClassFlow?: boolean;
  invocationChaining?: boolean;
};

type Return =
  | {
      updatedIndex: number;
      stop: boolean;
    }
  | undefined;

export const invocationFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  openedContexts,
  isFromClassFlow,
  invocationChaining,
}: InvocationFlowArgs): Return => {
  if (
    newTokenValue !== "(" ||
    (previousTokensSummary[previousTokensSummary.length - 1] !== TokenTypes.VARIABLE &&
      previousTokensSummary[previousTokensSummary.length - 1] !== TokenTypes.CLASS_NAME &&
      !invocationChaining)
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
          openedContexts,
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

  if (!isFromClassFlow) {
    const nextInLine = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex: expectedParenthesisEnd.currentIndex,
      previousTokensSummary,
    });

    const invocation =
      typedInvocationFlow({
        tokens,
        input,
        previousTokensSummary,
        openedContexts,
        invocationChaining: true,
        ...nextInLine.breakpoint,
      }) ||
      invocationFlow({
        tokens,
        input,
        previousTokensSummary,
        openedContexts,
        invocationChaining: true,
        ...nextInLine.breakpoint,
      });

    if (invocation) {
      return invocation;
    }

    return {
      updatedIndex: nextInLine.space?.updatedIndex ?? expectedParenthesisEnd.currentIndex,
      stop: false,
    };
  }

  return {
    updatedIndex: expectedParenthesisEnd.currentIndex,
    stop: false,
  };
};
