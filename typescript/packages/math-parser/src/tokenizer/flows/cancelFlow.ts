import { BaseToken } from "../types";
import { parenthesisFlow } from "../flows/parenthesisFlow";

type CancelFlowArgs = {
  input: string;
  currentIndex: number;
};

export const cancelFlow = ({ input, currentIndex }: CancelFlowArgs) => {
  const innerTokens: BaseToken[] = [];

  let duplicatedInput = input.slice();
  let currentChar = duplicatedInput.charAt(0);

  if (currentChar !== "(") {
    throw new Error(
      `Encountered an unexpected character on index ${currentIndex} after cancel, when expected "("`,
    );
  }

  const { tokens, newInput, updatedIndex } = parenthesisFlow({
    input: duplicatedInput,
    currentIndex,
    isWithinRoot: true,
  });

  innerTokens.push(...tokens);
  duplicatedInput = newInput;
  currentIndex = updatedIndex;

  return {
    tokens: innerTokens,
    newInput: duplicatedInput,
    updatedIndex: currentIndex,
  };
};
