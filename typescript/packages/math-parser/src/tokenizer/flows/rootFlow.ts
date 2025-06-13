import { type BaseToken } from "../types";
import { parenthesisFlow } from "./parenthesisFlow";

type RootFlowArgs = {
  input: string;
  currentIndex: number;
};

export const rootFlow = ({ input, currentIndex }: RootFlowArgs) => {
  const innerTokens: BaseToken[] = [];

  let duplicatedInput = input.slice();
  const currentChar = duplicatedInput.charAt(0);

  if (currentChar !== "(") {
    throw new Error(
      `Encountered an unexpected character on index ${currentIndex} after root, when expected "("`,
    );
  }

  const { tokens, newInput, updatedIndex } = parenthesisFlow({
    input: duplicatedInput,
    currentIndex,
    isWithinRoot: true,
  });

  const hasComa = tokens.find((token) => token.value === ",");
  if (!hasComa) {
    throw new Error(
      `Root ended unexpectedly without a coma to separate between the base and power.`,
    );
  }

  innerTokens.push(...tokens);
  duplicatedInput = newInput;
  currentIndex = updatedIndex;

  return {
    tokens: innerTokens,
    newInput: duplicatedInput,
    updatedIndex: currentIndex,
  };
};
