import { TokenTypes } from "../constants";
import { unicodes } from "../uniqueUnicodes";
import { getNextNonSpaceCharIndex, isCharacterLetter } from "../utils";

type DeltaFlowArgs = {
  input: string;
  currentIndex: number;
};

export const deltaFlow = ({ input, currentIndex }: DeltaFlowArgs) => {
  let duplicatedInput = input.slice();
  let value = duplicatedInput.charAt(0);
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
    throw new Error(
      `The input ended unexpectedly after a ${unicodes.javascript.capitalDelta} sign.`,
    );
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
  const isValid = isCharacterLetter({ currentChar: followingChar });
  if (!isValid) {
    throw new Error(
      `Encountered an unexpected character ${followingChar} after ${currentChar} on index ${currentIndex}, while expected a character.`,
    );
  }
};
