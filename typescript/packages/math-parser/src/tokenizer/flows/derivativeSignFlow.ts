import { TokenTypes } from "../constants";
import { BaseToken } from "../types";
import { getNextNonSpaceCharIndex } from "../utils";

type DerivativeSignFlowArgs = {
  tokens: BaseToken[];
  input: string;
  currentIndex: number;
};

export const derivativeSignFlow = ({ tokens, input, currentIndex }: DerivativeSignFlowArgs) => {
  let duplicatedInput = input.slice();
  let value = duplicatedInput.charAt(0);
  isValidPreviousToken({ tokens, currentChar: value, currentIndex });

  duplicatedInput = duplicatedInput.slice(1);

  const { skippedIndexes } = getNextNonSpaceCharIndex({ input: duplicatedInput });
  if (skippedIndexes !== undefined) {
    currentIndex += skippedIndexes;
    duplicatedInput = duplicatedInput.slice(skippedIndexes);
  }
  //   else {
  //     throw new Error(`The input ended unexpectedly after a derivative sign '.`);
  //   }

  const token = {
    type: TokenTypes.UNIQUE_TOKEN,
    value,
  };

  return {
    token,
    newInput: duplicatedInput,
    updatedIndex: currentIndex,
  };
};

type IsValidPreviousTokenArgs = {
  tokens: BaseToken[];
  currentChar: string;
  currentIndex: number;
};

const isValidPreviousToken = ({ tokens, currentChar, currentIndex }: IsValidPreviousTokenArgs) => {
  const lastToken = tokens[tokens.length - 1];
  if (lastToken.type !== TokenTypes.VARIABLE && lastToken.value !== ")") {
    throw new Error(
      `Encountered an unexpected derivative character ${currentChar} after ${lastToken.value} on index ${currentIndex}.`,
    );
  }
};
