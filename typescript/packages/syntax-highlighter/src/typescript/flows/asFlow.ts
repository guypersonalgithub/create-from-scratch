import { TokenTypeOptions, TokenTypes } from "../constants";
import { BaseToken } from "../types";
import { definitionSpaceHelper, iterateOverSteps, StepCallback } from "../utils";
import { typeFlow } from "./typeFlow";

type AsFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const asFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: AsFlowArgs) => {
  if (newTokenValue !== "as") {
    return;
  }

  tokens.push({ type: TokenTypes.AS, value: newTokenValue });

  const stepCallbacks: StepCallback[] = [
    {
      callback: ({ currentIndex, newTokenValue }) => {
        const space = definitionSpaceHelper({
          tokens,
          newTokenValue,
          input,
          currentIndex,
          previousTokensSummary,
        });

        if (space.stop) {
          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: true,
          };
        }

        const type = typeFlow({
          tokens,
          input,
          currentIndex: space.updatedIndex,
          previousTokensSummary,
        });

        if (type.stop) {
          return {
            updatedIndex: space.updatedIndex,
            stop: true,
          };
        }

        return type;
      },
      stop: true,
    },
    {
      callback: ({ currentIndex, newTokenValue }) => {
        if (newTokenValue !== "as") {
          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: false,
            exit: true,
          };
        }

        tokens.push({ type: TokenTypes.AS, value: newTokenValue });
        previousTokensSummary.push(TokenTypes.AS);

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

  return {
    updatedIndex: currentIndex,
    stop: shouldStop,
  };
};
