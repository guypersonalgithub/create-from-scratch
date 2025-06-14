import { TokenTypes } from "../constants";
import { nonConsecutiveOperators } from "../uniqueTokens";
import { getNextNonSpaceCharIndex } from "@packages/utils";

type InequalitySignsFlow = {
  input: string;
  currentIndex: number;
};

export const inequalitySignsFlow = ({ input, currentIndex }: InequalitySignsFlow) => {
  let duplicatedInput = input.slice();
  const value = duplicatedInput.charAt(0);
  duplicatedInput = duplicatedInput.slice(1);

  const { skippedIndexes } = getNextNonSpaceCharIndex({ input: duplicatedInput });
  if (skippedIndexes !== undefined) {
    currentIndex += skippedIndexes;
    duplicatedInput = duplicatedInput.slice(skippedIndexes);
    const followingChar = duplicatedInput.charAt(0);

    isValidFollowingToken({
      currentChar: value,
      followingChar,
      currentIndex,
    });
  } else {
    throw new Error(`The input ended unexpectedly after a = sign.`);
  }

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

type IsValidFollowingTokenArgs = {
  currentChar: string;
  followingChar: string;
  currentIndex: number;
};

const isValidFollowingToken = ({
  currentChar,
  followingChar,
  currentIndex,
}: IsValidFollowingTokenArgs) => {
  const isValid = followingChar !== "-" ? !nonConsecutiveOperators.has(followingChar) : true;
  if (!isValid) {
    throw new Error(
      `Encountered an unexpected character ${followingChar} after ${currentChar} on index ${currentIndex}.`,
    );
  }
};
