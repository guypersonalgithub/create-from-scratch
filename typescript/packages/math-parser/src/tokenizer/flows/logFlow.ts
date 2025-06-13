import { type BaseToken } from "../types";
import { parenthesisFlow } from "./parenthesisFlow";

type LogFlowArgs = {
  input: string;
  currentIndex: number;
};

export const logFlow = ({ input, currentIndex }: LogFlowArgs) => {
  const innerTokens: BaseToken[] = [];

  let duplicatedInput = input.slice();
  const currentChar = duplicatedInput.charAt(0);

  if (currentChar !== "(") {
    throw new Error(
      `Encountered an unexpected character on index ${currentIndex} after log, when expected "("`,
    );
  }

  const { tokens, newInput, updatedIndex } = parenthesisFlow({
    input: duplicatedInput,
    currentIndex,
    isWithinLog: true,
  });

  const hasComa = tokens.find((token) => token.value === ",");
  if (!hasComa) {
    throw new Error(
      `Log ended unexpectedly without a coma to separate between the base and value.`,
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
