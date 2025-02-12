import { isCharacterLetter } from "@packages/utils";
import { TokenTypeOptions, TokenTypes } from "../constants";
import { BaseToken } from "../types";
import { findLastNonSpaceToken, iterateOverSteps, spaceCallback, StepCallback } from "../utils";
import { stringFlow } from "./stringFlow";

type TypeFlowArgs = {
  tokens: BaseToken[];
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const typeFlow = ({ tokens, input, currentIndex, previousTokensSummary }: TypeFlowArgs) => {
  const stepCallbacks: StepCallback<{ hasType?: boolean }>[] = [
    spaceCallback({ tokens, input, stop: false, previousTokensSummary }),
    {
      callback: ({ currentIndex, newTokenValue }, sharedData) => {
        if (newTokenValue !== "&" && newTokenValue !== "|") {
          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: false,
            exit: !!sharedData?.hasType,
          };
        }

        const lastNonSpaceToken = findLastNonSpaceToken({ tokens });
        const { value } = lastNonSpaceToken ?? {};

        if (value === "&" || value === "|") {
          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: true,
          };
        }

        const token = {
          type: newTokenValue === "|" ? TokenTypes.TYPE_AND : TokenTypes.TYPE_OR,
          value: newTokenValue,
        };

        tokens.push(token);
        previousTokensSummary.push(token.type);

        return {
          updatedIndex: currentIndex,
          stop: false,
          hasType: true,
        };
      },
      stop: true,
    },
    spaceCallback({ tokens, input, stop: false, previousTokensSummary }),
    {
      callback: ({ currentIndex, newTokenValue }) => {
        const firstChar = newTokenValue.charAt(0);

        if (firstChar === "'" || firstChar === '"') {
          const str = stringFlow({
            tokens,
            newTokenValue: firstChar,
            input,
            currentIndex: currentIndex - (newTokenValue.length - 1),
            previousTokensSummary,
          });

          if (str) {
            return {
              updatedIndex: str.updatedIndex,
              stop: false,
              hasType: true,
            };
          }
        }

        if (!isCharacterLetter({ currentChar: firstChar })) {
          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: true,
          };
        }

        tokens.push({ type: TokenTypes.TYPE, value: newTokenValue });
        previousTokensSummary.push(TokenTypes.TYPE);

        return {
          updatedIndex: currentIndex,
          stop: false,
          hasType: true,
        };
      },
      stop: true,
    },
  ];

  let shouldStop = false;
  let previousSharedData = {};

  while (currentIndex < input.length) {
    const { updatedIndex, stop, exit, sharedData } = iterateOverSteps({
      input,
      currentIndex,
      stepCallbacks,
      previousSharedData,
    });
    currentIndex = updatedIndex;

    if (exit) {
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

  const lastToken = tokens[tokens.length - 1];
  const { value } = lastToken;
  if (value === "|" || value === "&") {
    return {
      updatedIndex: currentIndex,
      stop: true,
    };
  }

  return {
    updatedIndex: currentIndex,
    stop: shouldStop,
  };
};
