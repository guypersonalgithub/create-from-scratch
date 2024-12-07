import { TokenTypes } from "../constants";
import { getNextNonSpaceCharIndex } from "@packages/utils";

type FactorialFlowArgs = {
  input: string;
  currentIndex: number;
  isWithinParenthesis?: boolean;
};

export const factorialFlow = ({ input, currentIndex, isWithinParenthesis }: FactorialFlowArgs) => {
  let duplicatedInput = input.slice(1);
  currentIndex++;
  const { skippedIndexes } = getNextNonSpaceCharIndex({ input: duplicatedInput });
  if (skippedIndexes !== undefined) {
    currentIndex += skippedIndexes;
    duplicatedInput = duplicatedInput.slice(skippedIndexes);
    const followingChar = duplicatedInput.charAt(0);

    isValidFollowingToken({
      followingChar,
      currentIndex,
      isWithinParenthesis,
    });
  }

  const token = {
    type: TokenTypes.UNIQUE_OPERATION,
    value: "!",
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
};

const isValidFollowingToken = ({
  followingChar,
  currentIndex,
  isWithinParenthesis,
}: IsValidFollowingTokenArgs) => {
  if (!isWithinParenthesis && followingChar === ")") {
    throw new Error(`Encountered an unexpected closing parenthesis on index ${currentIndex}`);
  }
};
