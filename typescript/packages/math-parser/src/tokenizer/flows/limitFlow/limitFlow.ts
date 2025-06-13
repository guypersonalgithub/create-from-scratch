import { TokenTypes } from "../../constants";
import { type BaseToken } from "../../types";
import { variableLimit } from "./variableLimit";

type LimitFlowArgs = {
  input: string;
  currentIndex: number;
};

export const limitFlow = ({ input, currentIndex }: LimitFlowArgs) => {
  const tokens: BaseToken[] = [];
  let duplicatedInput = input.slice(0);

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

  // const { newInput, updatedIndex } = limitFlow({ tokens, input: duplicatedInput, currentIndex });
  // if (newInput !== undefined) {
  //   duplicatedInput = newInput;
  //   currentIndex = updatedIndex;
  // }

  return {
    tokens,
    newInput: duplicatedInput,
    updatedIndex: currentIndex,
  };
};
