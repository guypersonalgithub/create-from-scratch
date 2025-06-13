import { type TokenTypeOptions, TokenTypes } from "../constants";
import { nameFlow } from "../nameFlow";
import { type BaseToken, type OpenedContext } from "../types";
import { iterateOverSteps, spaceCallback, type StepCallback } from "../utils";
import { expressionInterpolationFlow } from "./expressionInterpolationFlow";
import { spaceFollowUpFlow } from "./genericFlows";
import { stringFlow } from "./stringFlows";

type JSXFlowArgs = {
  tokens: BaseToken[];
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  openedContexts: OpenedContext[];
};

export const JSXFlow = ({
  tokens,
  input,
  currentIndex,
  previousTokensSummary,
  openedContexts,
}: JSXFlowArgs) => {
  const stepCallbacks: StepCallback[] = [
    spaceCallback({ tokens, input, stop: false, previousTokensSummary }),
    {
      callback: ({ currentIndex, newTokenValue }) => {
        const name = nameFlow({ newTokenValue, currentIndex });

        if (name.stop) {
          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: false,
            exit: name.stop,
          };
        }

        tokens.push({ type: TokenTypes.JSX_PROPERTY, value: newTokenValue });

        return {
          updatedIndex: currentIndex,
          stop: false,
        };
      },
      stop: true,
    },
    spaceCallback({ tokens, input, stop: false, previousTokensSummary }),
    {
      callback: ({ currentIndex, newTokenValue }) => {
        if (newTokenValue !== "=") {
          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: false,
          };
        }

        tokens.push({ type: TokenTypes.EQUAL, value: newTokenValue });

        const { breakpoint, space } = spaceFollowUpFlow({
          tokens,
          input,
          currentIndex,
          previousTokensSummary,
        });
        const value =
          expressionInterpolationFlow({
            tokens,
            input,
            previousTokensSummary,
            openedContexts,
            ...breakpoint,
          }) || stringFlow({ tokens, input, previousTokensSummary, ...breakpoint });

        if (!value) {
          return {
            updatedIndex: space?.updatedIndex ?? currentIndex,
            stop: true,
          };
        }

        return {
          updatedIndex: value.updatedIndex,
          stop: false,
        };
      },
      stop: true,
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
      stop: true,
    };
  }

  const upcoming = spaceFollowUpFlow({ tokens, input, currentIndex, previousTokensSummary });
  if (upcoming.breakpoint.newTokenValue === "/") {
    tokens.push({ type: TokenTypes.OPERATOR, value: upcoming.breakpoint.newTokenValue });
    const following = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex: upcoming.breakpoint.currentIndex,
      previousTokensSummary,
    });
    if (following.breakpoint.newTokenValue !== ">") {
      return {
        updatedIndex: upcoming.breakpoint.currentIndex,
        stop: true,
      };
    }

    tokens.push({ type: TokenTypes.ANGLE, value: following.breakpoint.newTokenValue });

    return {
      updatedIndex: following.breakpoint.currentIndex,
      stop: false,
    };
  }

  if (upcoming.breakpoint.newTokenValue !== ">") {
    return {
      updatedIndex: currentIndex,
      stop: true,
    };
  }

  tokens.push({ type: TokenTypes.ANGLE, value: upcoming.breakpoint.newTokenValue });

  return {
    updatedIndex: upcoming.breakpoint.currentIndex,
    stop: false,
  };
};
