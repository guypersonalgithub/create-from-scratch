import { TokenTypeOptions, TokenTypes } from "../constants";
import { BaseToken } from "../types";
import {
  definitionSpaceHelper,
  iterateOverSteps,
  spaceCallback,
  StepCallback,
  findNextBreakpoint,
  shouldBreak,
  dotCallback,
} from "../utils";
import { stringFlow } from "./stringFlows";

type ImportFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const importFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: ImportFlowArgs) => {
  if (newTokenValue !== "import") {
    return;
  }

  tokens.push({ type: TokenTypes.IMPORT, value: newTokenValue });
  previousTokensSummary.push(TokenTypes.IMPORT);

  const stepCallbacks: StepCallback[] = [
    dotCallback({ tokens, stop: false, previousTokensSummary, exit: true }),
    spaceCallback({ tokens, input, stop: true, previousTokensSummary }),
    dotCallback({ tokens, stop: false, previousTokensSummary, exit: true }),
    {
      callback: ({ currentIndex, newTokenValue }) => {
        const firstChar = newTokenValue.charAt(0);
        const isIncorrectExportDefault =
          shouldBreak({
            currentChar: firstChar,
          }) && firstChar !== "_";

        if (isIncorrectExportDefault) {
          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: true,
          };
        }

        tokens.push({ type: TokenTypes.IMPORT_VARIABLE, value: newTokenValue });
        previousTokensSummary.push(TokenTypes.IMPORT_VARIABLE);

        const potentialSpace = findNextBreakpoint({ input, currentIndex });
        const { updatedIndex } = definitionSpaceHelper({
          ...potentialSpace,
          tokens,
          input,
          previousTokensSummary,
        });
        const potentialComma = findNextBreakpoint({ input, currentIndex: updatedIndex });

        if (potentialComma.newTokenValue === ",") {
          tokens.push({ type: TokenTypes.COMMA, value: potentialComma.newTokenValue });
          previousTokensSummary.push(TokenTypes.COMMA);

          return {
            updatedIndex: potentialComma.currentIndex,
            stop: false,
          };
        }

        return {
          updatedIndex: updatedIndex,
          stop: false,
        };
      },
      stop: false,
    },
    spaceCallback({ tokens, input, stop: false, previousTokensSummary }),
    {
      callback: ({ currentIndex, newTokenValue }) => {
        if (newTokenValue !== "{") {
          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: false,
          };
        }

        tokens.push({ type: TokenTypes.IMPORT_CURLY_BRACKET, value: newTokenValue });

        const potentialSpace = findNextBreakpoint({ input, currentIndex });
        const { updatedIndex } = definitionSpaceHelper({
          ...potentialSpace,
          tokens,
          input,
          previousTokensSummary,
        });
        currentIndex = updatedIndex;

        const stepCallbacks: StepCallback<{ hasVariable?: boolean }>[] = [
          {
            callback: ({ currentIndex, newTokenValue }) => {
              const firstChar = newTokenValue.charAt(0);
              const isIncorrectSpecificImportName =
                shouldBreak({
                  currentChar: firstChar,
                }) && firstChar !== "_";

              if (isIncorrectSpecificImportName) {
                return {
                  updatedIndex: currentIndex - newTokenValue.length,
                  stop: true,
                };
              }

              tokens.push({ type: TokenTypes.IMPORT_VARIABLE, value: newTokenValue });
              previousTokensSummary.push(TokenTypes.IMPORT_VARIABLE);

              return {
                updatedIndex: currentIndex,
                stop: false,
                hasVariable: true,
              };
            },
            stop: true,
          },
          spaceCallback({ tokens, input, stop: false, previousTokensSummary }),
          {
            callback: ({ currentIndex, newTokenValue }) => {
              if (newTokenValue !== "as") {
                return {
                  updatedIndex: currentIndex - newTokenValue.length,
                  stop: false,
                };
              }

              tokens.push({ type: TokenTypes.AS, value: newTokenValue });
              previousTokensSummary.push(TokenTypes.AS);

              const potentialSpace = findNextBreakpoint({ input, currentIndex });
              const { updatedIndex, stop } = definitionSpaceHelper({
                ...potentialSpace,
                tokens,
                input,
                previousTokensSummary,
              });

              if (stop) {
                return {
                  updatedIndex,
                  stop: true,
                };
              }

              const nameCast = findNextBreakpoint({ input, currentIndex: updatedIndex });

              const firstChar = nameCast.newTokenValue.charAt(0);
              const isIncorrectSpecificImportName =
                shouldBreak({
                  currentChar: firstChar,
                }) && firstChar.charAt(0) !== "_";

              if (isIncorrectSpecificImportName) {
                return {
                  updatedIndex,
                  stop: true,
                };
              }

              tokens.push({ type: TokenTypes.IMPORT_VARIABLE, value: nameCast.newTokenValue });
              previousTokensSummary.push(TokenTypes.IMPORT_VARIABLE);

              return {
                updatedIndex: nameCast.currentIndex,
                stop: false,
              };
            },
            stop: true,
          },
          spaceCallback({ tokens, input, stop: false, previousTokensSummary }),
          {
            callback: ({ currentIndex, newTokenValue }, sharedData) => {
              if (newTokenValue !== ",") {
                return {
                  updatedIndex: currentIndex - newTokenValue.length,
                  stop: false,
                  exit: !!sharedData?.hasVariable,
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
          spaceCallback({ tokens, input, stop: false, previousTokensSummary }),
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

        const potentialCurlyBracket = findNextBreakpoint({
          input,
          currentIndex,
        });

        if (potentialCurlyBracket.newTokenValue !== "}") {
          return {
            updatedIndex: currentIndex,
            stop: true,
          };
        }

        tokens.push({
          type: TokenTypes.IMPORT_CURLY_BRACKET,
          value: potentialCurlyBracket.newTokenValue,
        });

        const potentialSpace2 = findNextBreakpoint({
          input,
          currentIndex: potentialCurlyBracket.currentIndex,
        });
        return definitionSpaceHelper({ ...potentialSpace2, tokens, input, previousTokensSummary });
      },
      stop: true,
    },
    {
      callback: ({ currentIndex, newTokenValue }) => {
        if (newTokenValue !== "from") {
          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: true,
          };
        }

        tokens.push({ type: TokenTypes.FROM, value: newTokenValue });
        previousTokensSummary.push(TokenTypes.FROM);

        return {
          updatedIndex: currentIndex,
          stop: false,
        };
      },
      stop: true,
    },
    spaceCallback({ tokens, input, stop: true, previousTokensSummary }),
    {
      callback: ({ currentIndex, newTokenValue }) => {
        const string = stringFlow({
          tokens,
          newTokenValue,
          input,
          currentIndex,
          previousTokensSummary,
        });

        if (!string) {
          return {
            updatedIndex: currentIndex - newTokenValue.length,
            stop: true,
          };
        }

        return string;
      },
      stop: true,
    },
  ];

  return iterateOverSteps({ input, currentIndex, stepCallbacks });
};
