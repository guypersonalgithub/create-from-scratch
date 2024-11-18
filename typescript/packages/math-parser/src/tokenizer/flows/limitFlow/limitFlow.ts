import { TokenTypes } from "../../constants";
import { BaseToken } from "../../types";
import { variableLimit } from "./variableLimit";

type LimitFlowArgs = {
  tokens: BaseToken[];
  input: string;
  currentIndex: number;
};

export const limitFlow = ({ tokens, input, currentIndex }: LimitFlowArgs) => {
  let duplicatedInput = input.slice(0);

  if (!isValidLimit({ input: duplicatedInput })) {
    return {};
  }

  duplicatedInput = duplicatedInput.slice(3);
  currentIndex += 3;

  tokens.push({
    type: TokenTypes.KEYWORD,
    value: "lim",
  });

  const { newInput: newInputVariableLimit, updatedIndex: updatedIndexVariableLimit } =
    variableLimit({
      tokens,
      input: duplicatedInput,
      currentIndex,
    });

  duplicatedInput = newInputVariableLimit;
  currentIndex = updatedIndexVariableLimit;

  const { newInput, updatedIndex } = limitFlow({ tokens, input: duplicatedInput, currentIndex });
  if (newInput !== undefined) {
    duplicatedInput = newInput;
    currentIndex = updatedIndex;
  }

  return {
    newInput: duplicatedInput,
    updatedIndex: currentIndex,
  };
};

type IsValidLimitArgs = {
  input: string;
};

const isValidLimit = ({ input }: IsValidLimitArgs) => {
  return input[0] === "l" && input[1] === "i" && input[2] === "m";
};
