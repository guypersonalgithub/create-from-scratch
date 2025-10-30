import { TokenTypes } from "../constants";
import { tokenizerFlows } from "./tokenizerFlows";
import { type BaseToken } from "../types";
import { isValidSectionStartingCharacter } from "../utils";
import { getNextNonSpaceCharIndex } from "@packages/string-utils";

type AbsoluteFlowArgs = {
  input: string;
  currentIndex: number;
  isWithinLimit?: boolean;
  isAnExpression?: boolean;
};

export const absoluteFlow = ({
  input,
  currentIndex,
  isWithinLimit,
  isAnExpression,
}: AbsoluteFlowArgs) => {
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
  isValidSectionStartingCharacter({ input: duplicatedInput, currentIndex, isAnExpression });
  let currentChar = duplicatedInput.charAt(0);

  while (duplicatedInput.length > 0 && currentChar !== "|") {
    const { newInput, updatedIndex } = tokenizerFlows({
      tokens: innerTokens,
      input: duplicatedInput,
      currentIndex,
      isWithinParenthesis: true,
      isWithinLimit,
      isAnExpression,
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

  duplicatedInput = duplicatedInput.slice(1);
  currentIndex++;

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
