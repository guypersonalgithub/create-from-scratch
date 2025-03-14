import { TokenTypeOptions, TokenTypes } from "../../constants";
import { BaseToken } from "../../types";
import { iterateOverSteps, shouldBreak, spaceCallback, StepCallback } from "../../utils";
import { typeValueFlow } from "./typeValueFlow";

type TypeDefinitionFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const typeDefinitionFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: TypeDefinitionFlowArgs) => {
  if (newTokenValue !== "type") {
    return;
  }

  tokens.push({ type: TokenTypes.TYPE_DEFINITION, value: newTokenValue });

  const stepCallbacks: StepCallback[] = [
    spaceCallback({ tokens, input, stop: false, previousTokensSummary }),
    {
      callback: ({ currentIndex, newTokenValue }) => {
        const firstChar = newTokenValue.charAt(0);
        const isIncorrectDefinitionName =
          shouldBreak({
            currentChar: firstChar,
          }) && firstChar !== "_";

        if (isIncorrectDefinitionName) {
          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: false, // there may be a variable named "type", so this isn't necessarily a mandatory step for correct syntax.
            exit: true,
          };
        }

        tokens.push({ type: TokenTypes.TYPE, value: newTokenValue });
        previousTokensSummary.push(TokenTypes.TYPE);

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
        if (newTokenValue !== "=") {
          const updatedIndex = currentIndex - newTokenValue.length;

          return {
            updatedIndex,
            stop: true,
          };
        }

        tokens.push({ type: TokenTypes.EQUAL, value: newTokenValue });
        previousTokensSummary.push(TokenTypes.EQUAL);

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
        
        return {
          updatedIndex: typeValue.updatedIndex,
          stop: typeValue.stop || !typeValue.addedNewToken,
        };
      },
      stop: true,
    },
  ];

  return iterateOverSteps({ input, currentIndex, stepCallbacks });
};
