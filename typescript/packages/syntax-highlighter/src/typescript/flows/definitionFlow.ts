import { definitionKeywords, TokenTypeOptions, TokenTypes } from "../constants";
import { BaseToken } from "../types";
import { iterateOverSteps, spaceCallback, StepCallback, shouldBreak } from "../utils";
import { angleFlow } from "./angleFlow";
import { parenthesisFlow } from "./parenthesisFlow";
import { typeFlow } from "./typeFlow";
import { valueFlow } from "./valueFlow";

type DefinitionFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  // context: Context;
  // currentLayeredContexts: CurrentLayeredContexts;
};

export const definitionFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  // context,
  // currentLayeredContexts,
}: DefinitionFlowArgs) => {
  if (!definitionKeywords.has(newTokenValue)) {
    return;
  }

  tokens.push({
    type: TokenTypes.DEFINITION,
    value: newTokenValue,
  });

  previousTokensSummary.push(TokenTypes.DEFINITION);

  const stepCallbacks: StepCallback<{
    definitionNameIndex?: number;
    previousTokensSummaryDefinitionNameIndex?: number;
  }>[] = [
    spaceCallback({ tokens, input, stop: true, previousTokensSummary }),
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
            stop: true,
          };
        }

        const previousToken = tokens[tokens.length - 1];
        const isDefinitionConst = previousToken.value === "const";
        const token = {
          type: isDefinitionConst ? TokenTypes.CONST_VARIABLE : TokenTypes.VARIABLE,
          value: newTokenValue,
        };
        tokens.push(token);
        previousTokensSummary.push(token.type);

        return {
          updatedIndex: currentIndex,
          stop: false,
          definitionNameIndex: tokens.length - 1,
          previousTokensSummaryDefinitionNameIndex: previousTokensSummary.length - 1,
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

        tokens.push({ type: TokenTypes.TYPE_COLON, value: newTokenValue });
        previousTokensSummary.push(TokenTypes.TYPE_COLON);

        return typeFlow({
          tokens,
          input,
          currentIndex,
          previousTokensSummary,
        });
      },
      stop: true,
    },
    spaceCallback({ tokens, input, stop: false, previousTokensSummary }),
    {
      callback: ({ currentIndex, newTokenValue }) => {
        if (newTokenValue !== "=") {
          return {
            updatedIndex: currentIndex - newTokenValue.length,
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
      callback: ({ currentIndex, newTokenValue }, sharedData) => {
        const amountOfTokens = tokens.length;
        const valueTokens = valueFlow({
          tokens,
          input,
          newTokenValue,
          currentIndex,
          previousTokensSummary,
          // context,
          // currentLayeredContexts,
        });

        if (valueTokens.stop) {
          return {
            updatedIndex: valueTokens.updatedIndex,
            stop: true,
          };
        }

        const newAmount = tokens.length;

        if (amountOfTokens === newAmount) {
          let hasCallback:
            | {
                updatedIndex: number;
                stop: boolean;
              }
            | undefined;

          const potentialGenericTypeFunction = angleFlow({
            tokens,
            newTokenValue,
            input,
            currentIndex,
            previousTokensSummary,
          });

          hasCallback = potentialGenericTypeFunction;

          if (!hasCallback) {
            hasCallback = parenthesisFlow({
              tokens,
              newTokenValue,
              input,
              currentIndex,
              previousTokensSummary,
            });
          }

          if (hasCallback) {
            const isLastTokenArrow = tokens[tokens.length - 1].type === TokenTypes.ARROW;
            if (
              isLastTokenArrow &&
              sharedData?.definitionNameIndex !== undefined &&
              sharedData?.previousTokensSummaryDefinitionNameIndex !== undefined
            ) {
              tokens[sharedData.definitionNameIndex].type = TokenTypes.FUNCTION;
              previousTokensSummary[sharedData.previousTokensSummaryDefinitionNameIndex] =
                TokenTypes.FUNCTION;
            }

            return {
              updatedIndex: hasCallback.updatedIndex,
              stop: false,
            };
          }
        }

        return {
          updatedIndex: valueTokens.updatedIndex,
          stop: false,
        };
      },
      stop: true,
    },
  ];

  // TODO: Add to context based off the definition type.

  return iterateOverSteps({ input, currentIndex, stepCallbacks });
};
