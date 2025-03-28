import { isNumeric } from "@packages/utils";
import { TokenTypeOptions, TokenTypes } from "../constants";
import { BaseToken, OpenedContext } from "../types";
import { iterateOverSteps, spaceCallback, StepCallback, shouldBreak } from "../utils";
import { angleFlow } from "./angleFlow";
import { parenthesisFlow } from "./parenthesisFlows";
import { typeFlow } from "./typeFlows";
import { valueFlow } from "./valueFlows";
import { partialFunctionFlow } from "./functionFlows";
import { spaceFollowUpFlow } from "./genericFlows";

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
        const firstChar = newTokenValue.charAt(0);
        const isIncorrectDefinitionName =
          shouldBreak({
            currentChar: firstChar,
          }) && firstChar !== "_";
        const isntNumericInClass = isWithinClassContext ? !isNumeric({ str: firstChar }) : false;

        if (isIncorrectDefinitionName && isntNumericInClass) {
          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: true,
          };
        }

        let definitionNameIndex: number | undefined;
        let previousTokensSummaryDefinitionNameIndex: number | undefined;

        if (!isWithinClassContext) {
          const previousToken = tokens[tokens.length - 1];
          const isDefinitionConst = previousToken.value === "const";
          const token = {
            type: isDefinitionConst ? TokenTypes.CONST_VARIABLE : TokenTypes.VARIABLE,
            value: newTokenValue,
          };
          tokens.push(token);
          previousTokensSummary.push(token.type);
          definitionNameIndex = tokens.length - 1;
          previousTokensSummaryDefinitionNameIndex = previousTokensSummary.length - 1;
        } else {
          const tokenType = isntNumericInClass
            ? TokenTypes.VARIABLE
            : TokenTypes.NUMERIC_CLASS_VARIABLE;
          tokens.push({ type: tokenType, value: newTokenValue });
          previousTokensSummary.push(tokenType);
          definitionNameIndex = tokens.length - 1;
          previousTokensSummaryDefinitionNameIndex = previousTokensSummary.length - 1;
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
          const hasCallback =
            angleFlow({
              tokens,
              newTokenValue,
              input,
              currentIndex,
              previousTokensSummary,
              openedContexts,
              isFromDefinitionFlow: true,
              expectingArrow: true,
            }) ||
            parenthesisFlow({
              tokens,
              newTokenValue,
              input,
              currentIndex,
              previousTokensSummary,
              openedContexts,
              isFromDefinitionFlow: true,
              expectedToBeAFunction: true,
              expectingArrow: true,
            });

          if (hasCallback) {
            if (hasCallback.stop) {
              return hasCallback;
            }

            const isFunction =
              hasCallback.hasArrow || (hasCallback as ReturnType<typeof angleFlow>)!.isFunction;
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
