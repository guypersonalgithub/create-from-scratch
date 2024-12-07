import { TokenTypes } from "../constants";
import { BaseToken } from "../types";
import { uniqueWords } from "../uniqueTokens";
import { isCharacterLetter, isValidSectionStartingCharacter } from "../utils";
import { getNextNonSpaceCharIndex } from "@packages/utils";

type UniqueFunctionFlowArgs = {
  input: string;
  currentIndex: number;
  isWithinParenthesis?: boolean;
  isAnExpression?: boolean;
};

const maximumUniqueFunctionLength = 6;

export const uniqueFunctionFlow = ({
  input,
  currentIndex,
  isWithinParenthesis,
  isAnExpression,
}: UniqueFunctionFlowArgs) => {
  const tokens: BaseToken[] = [];
  let value: string = "";

  let duplicatedInput = input.slice();
  let currentChar = duplicatedInput.charAt(0);

  while (
    duplicatedInput.length > 0 &&
    isCharacterLetter({ currentChar }) &&
    !uniqueWords.has(value) &&
    value.length < maximumUniqueFunctionLength
  ) {
    value += currentChar;
    duplicatedInput = duplicatedInput.slice(1);
    currentChar = duplicatedInput.charAt(0);
    currentIndex++;
  }

  if (currentChar === "h" && uniqueWords.has(`${value}h`)) {
    value += currentChar;
    duplicatedInput = duplicatedInput.slice(1);
    currentIndex++;
  }

  const isUniqueWord = uniqueWords.has(value);

  const { skippedIndexes } = getNextNonSpaceCharIndex({ input: duplicatedInput });
  if (skippedIndexes === undefined && isUniqueWord) {
    throw new Error(`Encountered a unique function without value at index ${currentIndex}`);
  }

  if (skippedIndexes !== undefined) {
    currentIndex += skippedIndexes;
    duplicatedInput = duplicatedInput.slice(skippedIndexes);

    if (isUniqueWord) {
      const followingChar = duplicatedInput.charAt(0);

      isValidFollowingToken({
        followingChar,
        currentIndex,
        isWithinParenthesis,
        isAnExpression,
      });
    }
  }

  if (isUniqueWord) {
    tokens.push({
      type: TokenTypes.KEYWORD,
      value,
    });
  } else {
    for (let i = 0; i < value.length; i++) {
      const currentChar = value[i];

      tokens.push({
        type: TokenTypes.VARIABLE,
        value: currentChar,
      });
    }
  }

  return {
    tokens,
    newInput: duplicatedInput,
    updatedIndex: currentIndex,
  };
};

type IsValidFollowingTokenArgs = {
  followingChar: string;
  currentIndex: number;
  isWithinParenthesis?: boolean;
  isAnExpression?: boolean;
};

const isValidFollowingToken = ({
  followingChar,
  currentIndex,
  isWithinParenthesis,
  isAnExpression,
}: IsValidFollowingTokenArgs) => {
  if (!isWithinParenthesis && followingChar === ")") {
    throw new Error(`Encountered an unexpected closing parenthesis on index ${currentIndex}`);
  }

  isValidSectionStartingCharacter({ input: followingChar, currentIndex, isAnExpression });
};
