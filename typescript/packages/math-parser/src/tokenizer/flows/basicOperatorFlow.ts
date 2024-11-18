import { TokenTypes } from "../constants";
import { nonConsecutiveOperators } from "../uniqueTokens";
import { getNextNonSpaceCharIndex } from "../utils";

type BasicOperatorFlowArgs = {
  input: string;
  currentIndex: number;
  isWithinLimit?: boolean;
};

export const basicOperatorFlow = ({
  input,
  currentIndex,
  isWithinLimit,
}: BasicOperatorFlowArgs) => {
  let duplicatedInput = input.slice();
  let value = duplicatedInput.charAt(0);
  duplicatedInput = duplicatedInput.slice(1);

  const { skippedIndexes } = getNextNonSpaceCharIndex({ input: duplicatedInput });
  if (skippedIndexes !== undefined) {
    currentIndex += skippedIndexes;
    duplicatedInput = duplicatedInput.slice(skippedIndexes);
    const followingChar = duplicatedInput.charAt(0);

    const { replacedValue, currentIndex: updatedIndex } = isValidFollowingToken({
      currentChar: value,
      followingChar,
      currentIndex,
      isWithinLimit,
    });

    if (replacedValue) {
      value = replacedValue;
      currentIndex = updatedIndex;
    }
  } else {
    throw new Error(`The input ended unexpectedly after a basic math operator.`);
  }

  const token = {
    type: value !== "/" ? TokenTypes.UNIQUE_TOKEN : TokenTypes.UNIQUE_OPERATION,
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
  isWithinLimit?: boolean;
};

const isValidFollowingToken = ({
  currentChar,
  followingChar,
  currentIndex,
  isWithinLimit,
}: IsValidFollowingTokenArgs) => {
  const isValid = followingChar !== "-" ? !nonConsecutiveOperators.has(followingChar) : true;
  if (
    !isValid || followingChar === ","
      ? !isValidFollowingComaToken({ currentChar, isWithinLimit })
      : false
  ) {
    throw new Error(
      `Encountered an unexpected character ${followingChar} after ${currentChar} on index ${currentIndex}.`,
    );
  }

  if (
    (currentChar === "-" && followingChar === "+") ||
    (currentChar === "+" && followingChar === "-")
  ) {
    return {
      replacedValue: "-",
      currentIndex: currentIndex + 1,
    };
  }

  if (currentChar === "-" && followingChar === "-") {
    return {
      replacedValue: "+",
      currentIndex: currentIndex + 1,
    };
  }

  return {};
};

type IsValidFollowingComaTokenArgs = {
  currentChar: string;
  isWithinLimit?: boolean;
};

const isValidFollowingComaToken = ({
  currentChar,
  isWithinLimit,
}: IsValidFollowingComaTokenArgs) => {
  if (!isWithinLimit) {
    return false;
  }

  return currentChar === "+" || currentChar === "-";
};
