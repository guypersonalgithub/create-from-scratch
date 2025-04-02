import { TokenTypeOptions, TokenTypes } from "../../constants";
import { BaseToken, OpenedContext } from "../../types";
import { spaceCallback, StepCallback, iterateOverSteps } from "../../utils";
import { spaceFollowUpFlow } from "../genericFlows";
import { asFlow } from "../typeFlows";
import { valueFlow } from "../valueFlows";
import { variableFlow } from "../variableFlow";
import { variablePropertyFlow } from "../variablePropertyFlow";

type ArrayFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  openedContexts: OpenedContext[];
};

type SharedStageData = {
  hasValue?: boolean;
};

export const arrayFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  openedContexts,
}: ArrayFlowArgs) => {
  if (newTokenValue !== "[") {
    return;
  }

  tokens.push({ type: TokenTypes.ARRAY_SQUARE_BRACKET, value: newTokenValue });

  const stepCallbacks: StepCallback<SharedStageData>[] = [
    spaceCallback({ tokens, input, stop: false, previousTokensSummary }),
    {
      callback: ({ currentIndex, newTokenValue }) => {
        const value = valueFlow({
          tokens,
          input,
          newTokenValue,
          currentIndex,
          previousTokensSummary,
          openedContexts,
          // context,
          // currentLayeredContexts,
        });

        return {
          updatedIndex: value.updatedIndex,
          stop: value.stop,
          hasValue: value.addedNewToken,
        };
      },
      stop: true,
    },
    spaceCallback({ tokens, input, stop: false, previousTokensSummary }),
    {
      callback: ({ currentIndex, newTokenValue }, sharedData) => {
        if (!sharedData?.hasValue) {
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
  let previousSharedData: SharedStageData = {};

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

  const last = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });

  if (last.breakpoint.newTokenValue !== "]") {
    return {
      updatedIndex: last.space?.updatedIndex ?? currentIndex,
      stop: true,
    };
  }

  tokens.push({ type: TokenTypes.ARRAY_SQUARE_BRACKET, value: last.breakpoint.newTokenValue });

  const { breakpoint, space } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex: last.breakpoint.currentIndex,
    previousTokensSummary,
  });

  const variableProperty = variablePropertyFlow({ tokens, previousTokensSummary, ...breakpoint });
  if (variableProperty) {
    const { breakpoint: following, space } = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex: variableProperty.updatedIndex,
      previousTokensSummary,
    });

    const property = variableFlow({
      tokens,
      input,
      previousTokensSummary,
      openedContexts,
      ...following,
    });

    if (!property) {
      return {
        updatedIndex: space?.updatedIndex ?? variableProperty.updatedIndex,
        stop: true,
      };
    }

    return property;
  }

  return {
    updatedIndex: space?.updatedIndex ?? last.breakpoint.currentIndex,
    stop: false,
  };
};
