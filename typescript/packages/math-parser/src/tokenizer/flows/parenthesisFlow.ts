import { TokenTypes } from "../constants";
import { tokenizerFlows } from "./tokenizerFlows";
import { BaseToken } from "../types";
import { isValidSectionStartingCharacter } from "../utils";
import { getNextNonSpaceCharIndex } from "@packages/utils";

type ParenthesisFlowArgs = {
  input: string;
  currentIndex: number;
  isWithinLog?: boolean;
  isWithinLimit?: boolean;
  isAnExpression?: boolean;
  isWithinRoot?: boolean;
};

export const parenthesisFlow = ({
  input,
  currentIndex,
  isWithinLog,
  isWithinLimit,
  isAnExpression,
  isWithinRoot,
}: ParenthesisFlowArgs) => {
  const innerTokens: BaseToken[] = [
    {
      type: TokenTypes.UNIQUE_TOKEN,
      value: "(",
    },
  ];

  let hasComa = false;

  let duplicatedInput = input.slice(1);
  currentIndex++;

  const { skippedIndexes } = getNextNonSpaceCharIndex({ input: duplicatedInput });
  if (skippedIndexes !== undefined) {
    currentIndex += skippedIndexes;
    duplicatedInput = duplicatedInput.slice(skippedIndexes);
  }
  isValidSectionStartingCharacter({ input: duplicatedInput, currentIndex, isAnExpression });
  let currentChar = duplicatedInput.charAt(0);

  while (duplicatedInput.length > 0 && currentChar !== ")") {
    if (currentChar === "," && (isWithinLog || isWithinRoot)) {
      if (hasComa) {
        throw new Error(
          `Unexpected second coma within a ${isWithinLog ? "log" : "root"} on index ${currentIndex}`,
        );
      }

      hasComa = true;

      innerTokens.push({
        type: TokenTypes.SPREAD,
        value: ",",
      });

      currentIndex++;
      duplicatedInput = duplicatedInput.slice(1);

      isValidSectionStartingCharacter({
        input: duplicatedInput,
        currentIndex,
        isAnExpression,
      });

      const { skippedIndexes } = getNextNonSpaceCharIndex({ input: duplicatedInput });
      if (skippedIndexes === undefined) {
        throw new Error(`log unexpectedly ended with a coma on index ${currentIndex}`);
      }

      const followingChar = duplicatedInput.slice(skippedIndexes).charAt(0);
      if (followingChar === ")") {
        throw new Error(
          `log unexpectedly has a closing parenthesis ")" after a coma on index ${currentIndex + 1}`,
        );
      }
    } else {
      const { newInput, updatedIndex } = tokenizerFlows({
        tokens: innerTokens,
        input: duplicatedInput,
        currentIndex,
        isWithinParenthesis: true,
        isWithinLog,
        isWithinLimit,
        isAnExpression,
        isWithinRoot,
      });

      if (newInput === undefined || !updatedIndex) {
        throw new Error(`Encountered an unexpected token ${currentChar} on index ${currentIndex}`);
      }

      duplicatedInput = newInput;
      currentIndex = updatedIndex;
    }

    const { skippedIndexes } = getNextNonSpaceCharIndex({ input: duplicatedInput });
    if (skippedIndexes !== undefined) {
      currentIndex += skippedIndexes;
      duplicatedInput = duplicatedInput.slice(skippedIndexes);
      currentChar = duplicatedInput.charAt(0);
    } else {
      break;
    }
  }

  const { skippedIndexes: skippedIndexesEndOfParenthesis } = getNextNonSpaceCharIndex({
    input: duplicatedInput,
  });
  if (skippedIndexesEndOfParenthesis === undefined) {
    throw new Error(
      `Parenthesis ended unexpectedly without a closing parenthesis on index ${currentIndex}`,
    );
  }
  currentIndex += skippedIndexesEndOfParenthesis;
  duplicatedInput = duplicatedInput.slice(skippedIndexesEndOfParenthesis);
  if (duplicatedInput.charAt(0) !== ")") {
    throw new Error(
      `Parenthesis ended unexpectedly without a closing parenthesis on index ${currentIndex}`,
    );
  }

  innerTokens.push({
    type: TokenTypes.UNIQUE_TOKEN,
    value: ")",
  });

  duplicatedInput = duplicatedInput.slice(1);

  const { skippedIndexes: skippedIndexesBeyondParenthesis } = getNextNonSpaceCharIndex({
    input: duplicatedInput,
  });
  if (skippedIndexesBeyondParenthesis !== undefined) {
    currentIndex += skippedIndexesBeyondParenthesis;
    duplicatedInput = duplicatedInput.slice(skippedIndexesBeyondParenthesis);
    currentChar = duplicatedInput.charAt(0);
  }

  return {
    tokens: innerTokens,
    newInput: duplicatedInput,
    updatedIndex: currentIndex,
  };
};
