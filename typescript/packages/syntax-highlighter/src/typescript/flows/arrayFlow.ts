import { TokenTypeOptions, TokenTypes } from "../constants";
import { BaseToken } from "../types";
import { spaceCallback, StepCallback, findNextBreakpoint } from "../utils";

type ArrayFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const arrayFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: ArrayFlowArgs) => {
  if (newTokenValue !== "[") {
    return;
  }

  tokens.push({ type: TokenTypes.ARRAY_SQUARE_BRACKET, value: newTokenValue });

  const stepCallbacks: StepCallback<{ hasSpace?: boolean }>[] = [
    {
      callback: ({ currentIndex, newTokenValue }) => {
        const space = spaceCallback({ tokens, input, stop: false, previousTokensSummary }).callback(
          {
            currentIndex,
            newTokenValue,
          },
        ) ?? { updatedIndex: currentIndex, stop: true };

        return {
          ...space,
          hasSpace: space.stop,
        };
      },
      stop: false,
    },
    {
      callback: ({ currentIndex, newTokenValue }, sharedData) => {
        if (newTokenValue !== ",") {
          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: !!sharedData?.hasSpace,
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

  const last = findNextBreakpoint({ input, currentIndex });
  if (last.newTokenValue !== "]") {
    return {
      updatedIndex: currentIndex,
      stop: true,
    };
  }

  tokens.push({ type: TokenTypes.ARRAY_SQUARE_BRACKET, value: last.newTokenValue });

  return {
    updatedIndex: currentIndex,
    stop: false,
  };
};
