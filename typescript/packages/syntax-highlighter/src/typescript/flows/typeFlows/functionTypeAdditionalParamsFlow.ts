import { TokenTypeOptions, TokenTypes } from "../../constants";
import { BaseToken } from "../../types";
import { iterateOverSteps, spaceCallback, StepCallback } from "../../utils";
import { variableFlow } from "../variableFlow";
import { typeValueFlow } from "./typeValueFlow";

type FunctionTypeAdditionalParamsFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const functionTypeAdditionalParamsFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: FunctionTypeAdditionalParamsFlowArgs) => {
  if (newTokenValue !== ",") {
    return;
  }

  tokens.push({ type: TokenTypes.COMMA, value: newTokenValue });

  const stepCallbacks: StepCallback[] = [
    spaceCallback({ tokens, input, stop: false, previousTokensSummary }),
    {
      callback: ({ currentIndex, newTokenValue }) => {
        const variable = variableFlow({
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

  return {
    updatedIndex: currentIndex,
    stop: false,
  };
};
