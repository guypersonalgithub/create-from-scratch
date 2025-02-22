import { TokenTypeOptions, TokenTypes } from "../constants";
import { BaseToken } from "../types";
import { shouldBreak } from "../utils";
import { functionCallFlow } from "./functionCallFlow";
import { spaceFollowUpFlow } from "./spaceFlow";

type VariableFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const variableFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: VariableFlowArgs) => {
  const firstChar = newTokenValue.charAt(0);
  const isIncorrectVariableName =
    shouldBreak({
      currentChar: firstChar,
    }) && firstChar !== "_";

  if (isIncorrectVariableName) {
    return;
  }

  tokens.push({ type: TokenTypes.VARIABLE, value: newTokenValue });
  previousTokensSummary.push(TokenTypes.VARIABLE);
  const variableIndex = tokens.length - 1;

  const { breakpoint, space } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });

  // TODO: Add optional generic type for function calls, with type extends ? a : b support.

  const functionCall = functionCallFlow({ tokens, input, previousTokensSummary, ...breakpoint });
  if (functionCall) {
    tokens[variableIndex].type = TokenTypes.FUNCTION_NAME;
  }

  return (
    functionCall ||
    space || {
      updatedIndex: currentIndex,
      stop: false,
    }
  );
};
