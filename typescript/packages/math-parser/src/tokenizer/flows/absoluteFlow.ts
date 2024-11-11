import { TokenTypes } from "../constants";
import { tokenizerFlows } from "./tokenizerFlows";
import { BaseToken } from "../types";
import { getNextNonSpaceCharIndex, isValidSectionStartingCharacter } from "../utils";

type AbsoluteFlowArgs = {
  input: string;
  currentIndex: number;
};

export const absoluteFlow = ({ input, currentIndex }: AbsoluteFlowArgs) => {
  const innerTokens: BaseToken[] = [
    {
      type: TokenTypes.UNIQUE_TOKEN,
      value: "|",
    },
  ];

  let duplicatedInput = input.slice(1);
  currentIndex++;
  const { skippedIndexes } = getNextNonSpaceCharIndex({ input: duplicatedInput });
  if (skippedIndexes !== undefined) {
    currentIndex += skippedIndexes;
    duplicatedInput = duplicatedInput.slice(skippedIndexes);
  }
  isValidSectionStartingCharacter({ input: duplicatedInput, currentIndex });
  let currentChar = duplicatedInput.charAt(0);

  while (duplicatedInput.length > 0 && currentChar !== "|") {
    const { newInput, updatedIndex } = tokenizerFlows({
      tokens: innerTokens,
      input: duplicatedInput,
      currentIndex,
      isWithinParenthesis: true,
    });

    if (newInput === undefined || !updatedIndex) {
      throw new Error(`Encountered an unexpected token ${currentChar} on index ${currentIndex}`);
    }

    duplicatedInput = newInput;
    currentIndex = updatedIndex;

    const { skippedIndexes } = getNextNonSpaceCharIndex({ input: duplicatedInput });
    if (skippedIndexes !== undefined) {
      currentIndex += skippedIndexes;
      duplicatedInput = duplicatedInput.slice(skippedIndexes);
      currentChar = duplicatedInput.charAt(0);
    } else {
      break;
    }
  }

  isValidFollowingToken({ followingChar: currentChar, currentIndex });

  innerTokens.push({
    type: TokenTypes.UNIQUE_TOKEN,
    value: "|",
  });

  return {
    tokens: innerTokens,
    newInput: duplicatedInput,
    updatedIndex: currentIndex,
  };
};

type IsValidFollowingTokenArgs = {
  followingChar: string;
  currentIndex: number;
};

const isValidFollowingToken = ({ followingChar, currentIndex }: IsValidFollowingTokenArgs) => {
  const isValid = followingChar === "|";
  if (!isValid) {
    throw new Error(
      `Encountered an unexpected character instead of the end of an absolute on index ${currentIndex}`,
    );
  }
};
