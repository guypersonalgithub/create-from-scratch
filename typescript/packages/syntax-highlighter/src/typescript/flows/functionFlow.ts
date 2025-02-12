import { BaseToken } from "../types";

type FunctionFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  isDefinitionValue?: boolean;
};

export const functionFlow = ({ tokens, newTokenValue, input, currentIndex, isDefinitionValue }: FunctionFlowArgs) => {
  const firstChar = newTokenValue.charAt(0);
  if (firstChar !== "@") {
    return;
  }

  return {
    updatedIndex: currentIndex,
    stop: false,
    isFunction: isDefinitionValue ? true : false,
  };
};
