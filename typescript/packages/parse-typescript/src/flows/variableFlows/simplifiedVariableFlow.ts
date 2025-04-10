import { TokenTypeOptions, TokenTypes } from "../../constants";
import { BaseToken } from "../../types";
import { shouldBreak } from "../../utils";

type SimplifiedVariableFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const simplifiedVariableFlow = ({
  tokens,
  newTokenValue,
  currentIndex,
  previousTokensSummary,
}: SimplifiedVariableFlowArgs) => {
  if (!newTokenValue) {
    return;
  }

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

  return {
    updatedIndex: currentIndex,
    stop: false,
  };
};
