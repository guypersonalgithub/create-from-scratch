import { TokenTypeOptions, TokenTypes } from "../../constants";
import { BaseToken } from "../../types";
import {
  findNextBreakpoint,
  iterateOverSteps,
  shouldBreak,
  spaceCallback,
  StepCallback,
} from "../../utils";
import { spaceFlow, spaceFollowUpFlow } from "../spaceFlow";
import { stringFlow } from "../stringFlows";
import { typeValueFlow } from "./typeValueFlow";

type ObjectTypeFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const objectTypeFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: ObjectTypeFlowArgs) => {
  if (newTokenValue !== "{") {
    return;
  }

  tokens.push({ type: TokenTypes.OBJECT_CURLY_TYPE_BRACKET, value: newTokenValue });

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
        if (newTokenValue !== "?") {
          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: false,
          };
        }

        tokens.push({ type: TokenTypes.OPERATOR, value: newTokenValue });

        return {
          updatedIndex: currentIndex,
          stop: false,
        };
      },
      stop: false,
    },
    spaceCallback({ tokens, input, stop: false, previousTokensSummary }),
    {
      callback: ({ currentIndex, newTokenValue }) => {
        if (newTokenValue !== ":") {
          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: true,
          };
        }

        tokens.push({ type: TokenTypes.OBJECT_COLON, value: newTokenValue });
        previousTokensSummary.push(TokenTypes.OBJECT_COLON);

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
        const typeValue = typeValueFlow({
          tokens,
          newTokenValue,
          input,
          currentIndex,
          previousTokensSummary,
        });
        if (!typeValue.addedNewToken) {
          return {
            updatedIndex: typeValue.updatedIndex,
            stop: true,
          };
        }

        return {
          updatedIndex: typeValue.updatedIndex,
          stop: typeValue.stop,
        };
      },
      stop: true,
    },
    spaceCallback({ tokens, input, stop: false, previousTokensSummary }),
    {
      callback: ({ currentIndex, newTokenValue }) => {
        const isComma = newTokenValue === ",";
        const isEndOfLine = newTokenValue === ";";
        if (!isComma && !isEndOfLine) {
          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: false,
          };
        }

        const type = isComma ? TokenTypes.COMMA : TokenTypes.END_OF_LINE;
        tokens.push({ type, value: newTokenValue });

        const next = findNextBreakpoint({ input, currentIndex });
        const potentialSpace = spaceFlow({ tokens, input, previousTokensSummary, ...next });

        return (
          potentialSpace || {
            updatedIndex: currentIndex,
            stop: false,
          }
        );
      },
      stop: false,
    },
  ];

  let shouldStop = false;
  // let previousSharedData = {};

  while (currentIndex < input.length) {
    const { updatedIndex, stop, exit, } = iterateOverSteps({
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

  const last = spaceFollowUpFlow({ tokens, input, currentIndex, previousTokensSummary });
  if (last.breakpoint.newTokenValue !== "}") {
    return {
      updatedIndex: last.space?.updatedIndex ?? currentIndex,
      stop: true,
    };
  }

  tokens.push({ type: TokenTypes.OBJECT_CURLY_TYPE_BRACKET, value: last.breakpoint.newTokenValue });

  return {
    updatedIndex: last.breakpoint.currentIndex,
    stop: false,
  };
};
