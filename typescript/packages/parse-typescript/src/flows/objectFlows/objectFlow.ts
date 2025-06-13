import { type TokenTypeOptions, TokenTypes } from "../../constants";
import { type BaseToken, type OpenedContext } from "../../types";
import { asFlow } from "../typeFlows";
import {
  definitionSpaceHelper,
  iterateOverSteps,
  spaceCallback,
  type StepCallback,
  findNextBreakpoint,
  shouldBreak,
} from "../../utils";
import { valueFlow } from "../valueFlows";
import { stringFlow } from "../stringFlows";
import { spaceFollowUpFlow } from "../genericFlows";

type ObjectFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  openedContexts: OpenedContext[];
};

export const objectFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  openedContexts,
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

        if (isIncorrectPropertyName && (firstChar === '"' || firstChar === "'")) {
          const key = stringFlow({
            tokens,
            newTokenValue,
            input,
            currentIndex,
            previousTokensSummary,
            isObjectKey: true,
          });

          if (key) {
            return key;
          }

          return {
            updatedIndex: currentIndex,
            stop: true,
          };
        } else if (isIncorrectPropertyName) {
          const isProperSyntax = newTokenValue === "}";

          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: !isProperSyntax,
            exit: isProperSyntax,
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
          openedContexts,
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

  const { breakpoint, space } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });
  if (breakpoint.newTokenValue !== "}") {
    return {
      updatedIndex: space?.updatedIndex ?? currentIndex,
      stop: true,
    };
  }

  tokens.push({ type: TokenTypes.OBJECT_CURLY_BRACKET, value: breakpoint.newTokenValue });

  return {
    updatedIndex: breakpoint.currentIndex,
    stop: false,
  };
};
