import { type BaseToken } from "../types";
import { parenthesisFlow } from "./parenthesisFlow";

type FloorFlowArgs = {
  input: string;
  currentIndex: number;
};

export const floorFlow = ({ input, currentIndex }: FloorFlowArgs) => {
  const innerTokens: BaseToken[] = [];

  let duplicatedInput = input.slice();
  const currentChar = duplicatedInput.charAt(0);

  if (currentChar !== "(") {
    throw new Error(
      `Encountered an unexpected character on index ${currentIndex} after floor, when expected "("`,
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
