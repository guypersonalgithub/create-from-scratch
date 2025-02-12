import { TokenTypeOptions, TokenTypes } from "../constants";
import { BaseToken } from "../types";
import { asFlow } from "./asFlow";
import {
  definitionSpaceHelper,
  iterateOverSteps,
  spaceCallback,
  StepCallback,
  findNextBreakpoint,
  shouldBreak,
} from "../utils";
import { valueFlow } from "./valueFlow";

type ObjectFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  // context: Context;
  // currentLayeredContexts: CurrentLayeredContexts;
};

export const objectFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  // context,
  // currentLayeredContexts,
}: ObjectFlowArgs) => {
  if (newTokenValue !== "{") {
    return;
  }

  tokens.push({ type: TokenTypes.OBJECT_CURLY_BRACKET, value: newTokenValue });

  const stepCallbacks: StepCallback[] = [
    spaceCallback({ tokens, input, stop: false, previousTokensSummary }),
    {
      callback: ({ currentIndex, newTokenValue }) => {
        const firstChar = newTokenValue.charAt(0);
        const isIncorrectPropertyName =
          shouldBreak({
            currentChar: firstChar,
          }) && firstChar !== "_";

        if (isIncorrectPropertyName) {
          const isProperSyntax = newTokenValue === "}";

          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: !isProperSyntax,
          };
        }

        tokens.push({ type: TokenTypes.OBJECT_PROPERTY, value: newTokenValue });
        previousTokensSummary.push(TokenTypes.OBJECT_PROPERTY);

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
        if (newTokenValue !== ":") {
          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: false,
          };
        }

        tokens.push({ type: TokenTypes.OBJECT_COLON, value: newTokenValue });
        previousTokensSummary.push(TokenTypes.OBJECT_COLON);

        const potentialSpace = findNextBreakpoint({
          input,
          currentIndex,
        });
        const { updatedIndex } = definitionSpaceHelper({
          ...potentialSpace,
          tokens,
          input,
          previousTokensSummary,
        });

        const potentialValue = findNextBreakpoint({ input, currentIndex: updatedIndex });
        const valueTokens = valueFlow({
          ...potentialValue,
          tokens,
          input,
          previousTokensSummary,
          // context,
          // currentLayeredContexts,
        });

        if (valueTokens.addedNewToken) {
          const potentialSpace = findNextBreakpoint({
            input,
            currentIndex: valueTokens.updatedIndex,
          });
          const { updatedIndex } = definitionSpaceHelper({
            ...potentialSpace,
            tokens,
            input,
            previousTokensSummary,
          });

          const potentialAs = findNextBreakpoint({ input, currentIndex: updatedIndex });
          const as = asFlow({ ...potentialAs, tokens, input, previousTokensSummary });

          if (!as) {
            return {
              updatedIndex,
              stop: false,
            };
          }

          if (as.stop) {
            return {
              updatedIndex: as.updatedIndex,
              stop: true,
            };
          }

          const potentialSpace2 = findNextBreakpoint({
            input,
            currentIndex: as.updatedIndex,
          });
          const { updatedIndex: updatedIndex2 } = definitionSpaceHelper({
            ...potentialSpace2,
            tokens,
            input,
            previousTokensSummary,
          });

          return {
            updatedIndex: updatedIndex2,
            stop: false,
          };
        }

        return {
          updatedIndex: valueTokens.updatedIndex,
          stop: false,
        };
      },
      stop: true,
    },
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
        };
      },
      stop: false,
    },
  ];

  let shouldStop = false;
  // let previousSharedData = {};

  while (currentIndex < input.length) {
    const { updatedIndex, stop, exit } = iterateOverSteps({
      input,
      currentIndex,
      stepCallbacks,
      // previousSharedData,
    });
    currentIndex = updatedIndex;

    if (exit) {
      break;
    }

    // if (sharedData) {
    //   previousSharedData = sharedData;
    // }

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

  const last = findNextBreakpoint({ input, currentIndex });
  if (last.newTokenValue !== "}") {
    return {
      updatedIndex: currentIndex,
      stop: true,
    };
  }

  tokens.push({ type: TokenTypes.OBJECT_CURLY_BRACKET, value: last.newTokenValue });

  return {
    updatedIndex: last.currentIndex,
    stop: false,
  };
};
