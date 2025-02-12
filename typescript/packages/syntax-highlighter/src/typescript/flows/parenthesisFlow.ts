import { TokenTypeOptions, TokenTypes } from "../constants";
import { BaseToken } from "../types";
import { asFlow } from "./asFlow";
import {
  iterateOverSteps,
  spaceCallback,
  StepCallback,
  findNextBreakpoint,
  definitionSpaceHelper,
} from "../utils";
import { typeFlow } from "./typeFlow";
import { valueFlow } from "./valueFlow";
import { arrowFlow } from "./arrowFlow";

type ParenthesisFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  // context: Context;
  // currentLayeredContexts: CurrentLayeredContexts;
};

type SharedStageData = {
  hasComma?: boolean;
  hasString?: boolean;
  hasAs?: boolean;
};

export const parenthesisFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
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

        const lastTokenIsString = tokens[tokens.length - 1].type === TokenTypes.STRING;
        const shouldStop = lastTokenIsString && !!sharedData?.hasComma;

        return {
          updatedIndex: value.updatedIndex,
          stop: shouldStop,
          hasString: lastTokenIsString,
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
            exit: !!sharedData?.hasString,
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

  let shouldStop = false;
  let previousSharedData: SharedStageData = {};
  let isntExpectedToBeFunction = false;

  while (currentIndex < input.length) {
    const { updatedIndex, stop, exit, sharedData, i } = iterateOverSteps({
      input,
      currentIndex,
      stepCallbacks,
      previousSharedData,
    });
    currentIndex = updatedIndex;

    if (exit) {
      isntExpectedToBeFunction = !!sharedData.hasAs || !!sharedData.hasString;
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

  const potentialSpace = findNextBreakpoint({
    input,
    currentIndex: expectedParenthesisEnd.currentIndex,
  });
  const { updatedIndex } = definitionSpaceHelper({
    ...potentialSpace,
    tokens,
    input,
    previousTokensSummary,
  });
  const potentialColon = findNextBreakpoint({ input, currentIndex: updatedIndex });
  let followingIndex = updatedIndex;
  if (potentialColon.newTokenValue === ":") {
    tokens.push({ type: TokenTypes.TYPE_COLON, value: newTokenValue });
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

  const potentialArrow = findNextBreakpoint({ input, currentIndex: followingIndex });
  const arrow = arrowFlow({ ...potentialArrow, tokens, input, previousTokensSummary });

  if (!arrow) {
    return {
      updatedIndex: followingIndex,
      stop: true,
    };
  }

  return arrow;
};
