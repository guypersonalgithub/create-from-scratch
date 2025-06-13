import { type TokenTypeOptions, TokenTypes } from "../../../constants";
import { type BaseToken } from "../../../types";
import { iterateOverSteps, spaceCallback, type StepCallback } from "../../../utils";
import { variableOnlyValueFlow } from "../../variableOnlyValueFlow";
import { typeValueFlow } from "../typeValueFlow";

type FunctionTypeAdditionalParamsFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  hasOptionalArgument?: boolean;
};

export const functionTypeAdditionalParamsFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  hasOptionalArgument = false,
}: FunctionTypeAdditionalParamsFlowArgs) => {
  if (newTokenValue !== ",") {
    return;
  }

  tokens.push({ type: TokenTypes.COMMA, value: newTokenValue });

  const stepCallbacks: StepCallback<{ hasOptionalArgument?: boolean }>[] = [
    spaceCallback({ tokens, input, stop: false, previousTokensSummary }),
    {
      callback: ({ currentIndex, newTokenValue }) => {
        const variable = variableOnlyValueFlow({
          tokens,
          newTokenValue,
          input,
          currentIndex,
          previousTokensSummary,
        });

        if (!variable) {
          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: false,
            exit: true,
          };
        }

        return variable;
      },
      stop: true,
    },
    spaceCallback({ tokens, input, stop: false, previousTokensSummary }),
    {
      callback: ({ currentIndex, newTokenValue }, sharedData) => {
        if (newTokenValue !== "?") {
          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: sharedData?.hasOptionalArgument ?? hasOptionalArgument,
          };
        }

        tokens.push({ type: TokenTypes.TYPE_OPTIONAL_ARGUMENT, value: newTokenValue });

        return {
          updatedIndex: currentIndex,
          stop: false,
          hasOptionalArgument: true,
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
            stop: true,
          };
        }

        tokens.push({ type: TokenTypes.TYPE_COLON, value: newTokenValue });
        previousTokensSummary.push(TokenTypes.TYPE_COLON);

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

  return {
    updatedIndex: currentIndex,
    stop: false,
  };
};
