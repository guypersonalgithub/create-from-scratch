import { TokenTypeOptions, TokenTypes } from "../../constants";
import { BaseToken } from "../../types";
import { iterateOverSteps, spaceCallback, StepCallback } from "../../utils";
import { spaceFollowUpFlow } from "../genericFlows";
import { typeValueFlow } from "../typeFlows";
import { variableOnlyValueFlow } from "../variableOnlyValueFlow";

type FunctionAdditionalParamsFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
} & HasType;

type HasType =
  | {
      hasType: boolean;
      hasOptionalArgument?: boolean;
    }
  | {
      hasType?: never;
      hasOptionalArgument?: never;
    };

export const functionAdditionalParamsFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  hasType = false,
  hasOptionalArgument = false,
}: FunctionAdditionalParamsFlowArgs) => {
  if (newTokenValue !== ",") {
    return;
  }

  tokens.push({ type: TokenTypes.COMMA, value: newTokenValue });

  const stepCallbacks: StepCallback<{ hasType?: boolean; hasOptionalArgument?: boolean }>[] = [
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

        if (!variable || (!variable.addedNewToken && !variable.stop)) {
          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: false,
            exit: true,
          };
        }

        return {
          updatedIndex: variable.updatedIndex,
          stop: false,
        };
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
      callback: ({ currentIndex, newTokenValue }, sharedData) => {
        if (newTokenValue !== ":") {
          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: sharedData?.hasType ?? sharedData?.hasOptionalArgument ?? hasType,
          };
        }

        tokens.push({ type: TokenTypes.TYPE_COLON, value: newTokenValue });
        previousTokensSummary.push(TokenTypes.TYPE_COLON);

        const { breakpoint, space } = spaceFollowUpFlow({ tokens, input, currentIndex, previousTokensSummary });

        const typeValue = typeValueFlow({
          tokens,
          input,
          previousTokensSummary,
          ...breakpoint,
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
