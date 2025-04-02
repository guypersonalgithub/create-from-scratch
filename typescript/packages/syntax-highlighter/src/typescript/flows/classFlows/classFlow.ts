import { TokenTypeOptions, TokenTypes } from "../../constants";
import { BaseToken, OpenedContext } from "../../types";
import { iterateOverSteps, shouldBreak, spaceCallback, StepCallback } from "../../utils";
import { nestedContextFlow } from "../nestedContextFlow";
import { genericTypeTemplateFlow } from "../typeFlows";

type ClassFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  openedContexts: OpenedContext[];
};

export const classFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  openedContexts,
}: ClassFlowArgs) => {
  if (newTokenValue !== "class") {
    return;
  }

  tokens.push({ type: TokenTypes.CLASS, value: newTokenValue });

  const stepCallbacks: StepCallback<{
    classNameIndex?: number;
  }>[] = [
    spaceCallback({ tokens, input, stop: true, previousTokensSummary }),
    {
      callback: ({ currentIndex, newTokenValue }) => {
        const firstChar = newTokenValue.charAt(0);
        const isIncorrectClassName =
          shouldBreak({
            currentChar: firstChar,
          }) && firstChar !== "_";

        if (isIncorrectClassName) {
          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: true,
          };
        }

        tokens.push({ type: TokenTypes.CLASS_NAME, value: newTokenValue });
        previousTokensSummary.push(TokenTypes.CLASS_NAME);
        const classNameIndex = tokens.length - 1;

        return {
          updatedIndex: currentIndex,
          stop: false,
          classNameIndex,
        };
      },
      stop: true,
    },
    spaceCallback({ tokens, input, stop: false, previousTokensSummary }),
    {
      callback: ({ currentIndex, newTokenValue }) => {
        if (newTokenValue !== "<") {
          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: false,
          };
        }

        const genericTypeTemplate = genericTypeTemplateFlow({
          tokens,
          input,
          previousTokensSummary,
          newTokenValue,
          currentIndex,
        });

        if (!genericTypeTemplate) {
          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: true,
          };
        }

        return genericTypeTemplate;
      },
      stop: true,
    },
    spaceCallback({ tokens, input, stop: false, previousTokensSummary }),
    {
      callback: ({ currentIndex, newTokenValue }, sharedData) => {
        if (newTokenValue !== "{") {
          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: false,
          };
        }

        tokens.push({ type: TokenTypes.CLASS_CURLY_BRACKET, value: newTokenValue });
        if (sharedData?.classNameIndex !== undefined) {
          const name = tokens[sharedData.classNameIndex].value;
          openedContexts.push({ name, type: "class" });

            return nestedContextFlow({
              tokens,
              input,
              currentIndex,
              previousTokensSummary,
              openedContexts,
            });
        }

        return {
          updatedIndex: currentIndex,
          stop: false,
        };
      },
      stop: true,
    },
    spaceCallback({ tokens, input, stop: false, previousTokensSummary }),
  ];

  return iterateOverSteps({ input, currentIndex, stepCallbacks });
};
