import { TokenTypeOptions, TokenTypes } from "../../constants";
import { BaseToken } from "../../types";
import { definitionSpaceHelper, iterateOverSteps, StepCallback } from "../../utils";
import { spaceFollowUpFlow } from "../genericFlows";
import { typeValueFlow } from "./typeValueFlow";

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
        const requiredSpace = definitionSpaceHelper({
          tokens,
          newTokenValue,
          input,
          currentIndex,
          previousTokensSummary,
        });

        if (requiredSpace.stop) {
          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: true,
          };
        }

        const { breakpoint, space } = spaceFollowUpFlow({
          tokens,
          input,
          currentIndex: requiredSpace.updatedIndex,
          previousTokensSummary,
        });

        const type = typeValueFlow({
          tokens,
          input,
          previousTokensSummary,
          isAsFlow: true,
          ...breakpoint,
        });

        if (type.stop) {
          return {
            updatedIndex: space?.updatedIndex ?? requiredSpace.updatedIndex,
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
