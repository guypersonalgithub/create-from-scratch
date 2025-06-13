import { type TokenTypeOptions, TokenTypes } from "../../constants";
import { type BaseToken } from "../../types";
import { iterateOverSteps, spaceCallback, type StepCallback } from "../../utils";
import { spaceFollowUpFlow } from "../genericFlows";
import { typeValueFlow } from "./typeValueFlow";

type ArrayTypeFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const arrayTypeFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: ArrayTypeFlowArgs) => {
  if (newTokenValue !== "[") {
    return;
  }

  tokens.push({ type: TokenTypes.ARRAY_SQUARE_TYPE_BRACKET, value: newTokenValue });

  const stepCallbacks: StepCallback<{ missingTypeInObject?: boolean }>[] = [
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
          const isArrayEnd = newTokenValue === "]";

          return {
            updatedIndex: isArrayEnd ? currentIndex - newTokenValue.length : typeValue.updatedIndex,
            stop: !isArrayEnd,
            exit: isArrayEnd,
            missingTypeInObject: typeValue.missingTypeInObject,
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
        if (newTokenValue !== ",") {
          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: false,
            exit: true,
          };
        }

        tokens.push({ type: TokenTypes.COMMA, value: newTokenValue });

        return {
          updatedIndex: currentIndex,
          stop: false,
        };
      },
      stop: false,
    },
  ];

  let shouldStop = false;
  let missingTypeInObject = false;
  // let previousSharedData = {};

  while (currentIndex < input.length) {
    const { updatedIndex, stop, exit, sharedData } = iterateOverSteps({
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
    if (sharedData?.missingTypeInObject) {
      missingTypeInObject = true;
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
      missingTypeInObject,
    };
  }

  const last = spaceFollowUpFlow({ tokens, input, currentIndex, previousTokensSummary });
  if (last.breakpoint.newTokenValue !== "]") {
    return {
      updatedIndex: last.space?.updatedIndex ?? currentIndex,
      stop: true,
    };
  }

  tokens.push({ type: TokenTypes.ARRAY_SQUARE_TYPE_BRACKET, value: last.breakpoint.newTokenValue });

  return {
    updatedIndex: last.breakpoint.currentIndex,
    stop: false,
  };
};
