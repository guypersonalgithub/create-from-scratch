import { TokenTypes } from "../constants";
import { uniqueTokens } from "../uniqueTokens";
import { getNextNonSpaceCharIndex, isCharacterLetter, isCharacterNumber } from "../utils";

type NumberFlowArgs = {
  input: string;
  currentIndex: number;
  isWithinParenthesis?: boolean;
  isWithinLog?: boolean;
  isWithinLimit?: boolean;
};

export const numberFlow = ({
  input,
  currentIndex,
  isWithinParenthesis,
  isWithinLog,
  isWithinLimit,
}: NumberFlowArgs) => {
  let hasDot = false;
  let value = "";

  let duplicatedInput = input.slice();
  let currentChar = duplicatedInput.charAt(0);

  while (
    duplicatedInput.length > 0 &&
    (isCharacterNumber({ currentChar }) || currentChar === ".")
  ) {
    const isDot = currentChar === ".";
    if (isDot && !hasDot) {
      if (value.length === 0) {
        value += "0.";
      }

      hasDot = true;
    } else if (hasDot) {
      throw new Error(`Encountered a second dot for one number on index ${currentIndex}`);
    }

    value += currentChar;
    duplicatedInput = duplicatedInput.slice(1);
    currentChar = duplicatedInput.charAt(0);
    currentIndex++;
  }

  const { skippedIndexes } = getNextNonSpaceCharIndex({ input: duplicatedInput });
  if (skippedIndexes !== undefined) {
    currentIndex += skippedIndexes;
    duplicatedInput = duplicatedInput.slice(skippedIndexes);
    const followingChar = duplicatedInput.charAt(0);

    isValidFollowingToken({
      followingChar,
      currentIndex,
      isWithinParenthesis,
      isWithinLog,
      isWithinLimit,
    });
  }

  const token = {
    type: TokenTypes.VALUE,
    value,
  };

  return {
    token,
    newInput: duplicatedInput,
    updatedIndex: currentIndex,
  };
};

type IsValidFollowingTokenArgs = {
  followingChar: string;
  currentIndex: number;
  isWithinParenthesis?: boolean;
  isWithinLog?: boolean;
  isWithinLimit?: boolean;
};

const isValidFollowingToken = ({
  followingChar,
  currentIndex,
  isWithinParenthesis,
  isWithinLog,
  isWithinLimit,
}: IsValidFollowingTokenArgs) => {
  if (!isWithinParenthesis && followingChar === ")") {
    throw new Error(`Encountered an unexpected closing parenthesis on index ${currentIndex}`);
  }

  const isValid =
    uniqueTokens.has(followingChar) ||
    isCharacterLetter({ currentChar: followingChar }) ||
    ((isWithinLog || isWithinLimit) ? followingChar === "," : false);

  if (!isValid) {
    throw new Error(
      `Encountered an unexpected character ${followingChar} after a numeric character on index ${currentIndex}`,
    );
  }
};
