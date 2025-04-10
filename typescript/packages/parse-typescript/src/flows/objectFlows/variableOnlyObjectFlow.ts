import { TokenTypeOptions, TokenTypes } from "../../constants";
import { BaseToken } from "../../types";
import { iterateOverSteps, spaceCallback, StepCallback } from "../../utils";
import { spaceFollowUpFlow } from "../genericFlows";
import { simplifiedVariableFlow } from "../variableFlows";
import { variableOnlyValueFlow } from "../variableOnlyValueFlow";

type VariableOnlyObjectFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  isType?: boolean;
};

export const variableOnlyObjectFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  isType,
}: VariableOnlyObjectFlowArgs) => {
  if (newTokenValue !== "{") {
    return;
  }

  tokens.push({ type: TokenTypes.OBJECT_CURLY_BRACKET, value: newTokenValue });

  const stepCallbacks: StepCallback[] = [
    spaceCallback({ tokens, input, stop: false, previousTokensSummary }),
    {
      callback: ({ currentIndex, newTokenValue }) => {
        const property = simplifiedVariableFlow({
          tokens,
          newTokenValue,
          currentIndex,
          previousTokensSummary,
        });

        if (!property) {
          const isProperSyntax = newTokenValue === "}";

          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: !isProperSyntax,
            exit: isProperSyntax,
          };
        }

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

        const { breakpoint, space } = spaceFollowUpFlow({
          tokens,
          input,
          currentIndex,
          previousTokensSummary,
        });

        const value = variableOnlyValueFlow({
          tokens,
          input,
          previousTokensSummary,
          isType,
          fromObject: true,
          ...breakpoint,
        });

        if (!value.addedNewToken || value.stop) {
          return {
            updatedIndex: space?.updatedIndex ?? currentIndex,
            stop: true,
          };
        }

        return {
          updatedIndex: value.updatedIndex,
          stop: false,
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

  while (currentIndex < input.length) {
    const { updatedIndex, stop, exit } = iterateOverSteps({
      input,
      currentIndex,
      stepCallbacks,
    });
    currentIndex = updatedIndex;

    if (exit) {
      break;
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
