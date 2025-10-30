import { isNumeric } from "@packages/string-utils";
import { type TokenTypeOptions, TokenTypes } from "../constants";
import { type BaseToken, type OpenedContext } from "../types";
import {
  iterateOverSteps,
  spaceCallback,
  type StepCallback,
  shouldBreak,
  findLastNonSpaceToken,
} from "../utils";
import { typeFlow } from "./typeFlows";
import { valueFlow } from "./valueFlows";
import { partialFunctionFlow } from "./functionFlows";
import { spaceFollowUpFlow } from "./genericFlows";
import { nestedContextFlow } from "./nestedContextFlow";
import { variableOnlyValueFlow } from "./variableOnlyValueFlow";

type PartialDefinitionFlowArgs = {
  tokens: BaseToken[];
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  openedContexts: OpenedContext[];
  isWithinClassContext?: boolean;
  withoutPreviousKeyword?: boolean;
};

export const partialDefinitionFlow = ({
  tokens,
  input,
  currentIndex,
  previousTokensSummary,
  openedContexts,
  isWithinClassContext,
  withoutPreviousKeyword,
}: PartialDefinitionFlowArgs) => {
  const stepCallbacks: StepCallback<{
    definitionNameIndex?: number;
    previousTokensSummaryDefinitionNameIndex?: number;
  }>[] = [
    spaceCallback({
      tokens,
      input,
      stop: !withoutPreviousKeyword ? true : false,
      previousTokensSummary,
    }),
    {
      callback: ({ currentIndex, newTokenValue }) => {
        if (!isWithinClassContext) {
          const previousToken = findLastNonSpaceToken({ tokens });
          if (!previousToken) {
            return {
              updatedIndex: currentIndex - newTokenValue.length,
              stop: true,
            };
          }
          const isDefinitionConst = previousToken.value === "const";
          const currentAmountOfTokens = tokens.length;

          const identifiers = variableOnlyValueFlow({
            tokens,
            newTokenValue,
            input,
            currentIndex,
            previousTokensSummary,
          });

          if (!identifiers.addedNewToken || identifiers.stop) {
            return {
              updatedIndex: identifiers.updatedIndex,
              stop: true,
            };
          }

          let definitionNameIndex: number | undefined;
          let previousTokensSummaryDefinitionNameIndex: number | undefined;

          if (isDefinitionConst) {
            for (let i = currentAmountOfTokens; i < tokens.length; i++) {
              const current = tokens[i];
              if (current.type === TokenTypes.VARIABLE) {
                current.type = TokenTypes.CONST_VARIABLE;
              }
            }
          }

          if (identifiers.isOnlyAVariable) {
            definitionNameIndex = tokens.length - 1;
            previousTokensSummaryDefinitionNameIndex = previousTokensSummary.length - 1;
          }

          return {
            updatedIndex: identifiers.updatedIndex,
            stop: false,
            definitionNameIndex,
            previousTokensSummaryDefinitionNameIndex,
          };
        }

        const firstChar = newTokenValue.charAt(0);
        const isIncorrectDefinitionName =
          shouldBreak({
            currentChar: firstChar,
          }) && firstChar !== "_";
        const isntNumericInClass = !isNumeric({ str: firstChar });

        if (isIncorrectDefinitionName && isntNumericInClass) {
          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: true,
          };
        }

        const tokenType = isntNumericInClass
          ? TokenTypes.VARIABLE
          : TokenTypes.NUMERIC_CLASS_VARIABLE;
        tokens.push({ type: tokenType, value: newTokenValue });
        previousTokensSummary.push(tokenType);
        const definitionNameIndex = tokens.length - 1;
        const previousTokensSummaryDefinitionNameIndex = previousTokensSummary.length - 1;
        const nameIndex = tokens.length - 1;
        const previousIndex = previousTokensSummary.length - 1;

        const partialFunction = partialFunctionFlow({
          tokens,
          input,
          currentIndex,
          previousTokensSummary,
          openedContexts,
          functionName: newTokenValue,
        });
        if (!partialFunction.stop) {
          tokens[nameIndex].type = TokenTypes.FUNCTION_NAME;
          previousTokensSummary[previousIndex] = TokenTypes.FUNCTION_NAME;

          return {
            ...partialFunction,
            exit: true,
          };
        } else {
          currentIndex = partialFunction.updatedIndex;
        }

        return {
          updatedIndex: currentIndex,
          stop: false,
          definitionNameIndex,
          previousTokensSummaryDefinitionNameIndex,
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

        const { breakpoint, space } = spaceFollowUpFlow({
          tokens,
          input,
          currentIndex,
          previousTokensSummary,
        });

        const type = typeFlow({
          tokens,
          input,
          previousTokensSummary,
          ...breakpoint,
        });

        if (!type) {
          return {
            updatedIndex: space?.updatedIndex ?? currentIndex,
            stop: true,
          };
        }

        return type;
      },
      stop: true,
    },
    spaceCallback({ tokens, input, stop: false, previousTokensSummary }),
    {
      callback: ({ currentIndex, newTokenValue }) => {
        if (newTokenValue !== "=") {
          const updatedIndex = currentIndex - newTokenValue.length;
          const stop = !isWithinClassContext ? true : false;
          const exit = !isWithinClassContext ? undefined : true;

          return {
            updatedIndex,
            stop,
            exit,
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
        const valueTokens = valueFlow({
          tokens,
          input,
          newTokenValue,
          currentIndex,
          previousTokensSummary,
          openedContexts,
          isFromDefinitionFlow: true,
          // context,
          // currentLayeredContexts,
        });

        if (valueTokens.stop) {
          return {
            updatedIndex: valueTokens.updatedIndex,
            stop: true,
          };
        }

        const isFunction = valueTokens.hasArrow;
        if (
          isFunction &&
          sharedData?.definitionNameIndex !== undefined &&
          sharedData?.previousTokensSummaryDefinitionNameIndex !== undefined
        ) {
          tokens[sharedData.definitionNameIndex].type = TokenTypes.FUNCTION_NAME;
          previousTokensSummary[sharedData.previousTokensSummaryDefinitionNameIndex] =
            TokenTypes.FUNCTION_NAME;
          openedContexts.push({
            name: tokens[sharedData.definitionNameIndex].value,
            type: "function",
          });

          return nestedContextFlow({
            tokens,
            input,
            currentIndex: valueTokens.updatedIndex,
            previousTokensSummary,
            openedContexts,
          });
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
