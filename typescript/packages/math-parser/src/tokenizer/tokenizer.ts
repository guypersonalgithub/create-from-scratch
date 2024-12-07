import { BaseToken } from "./types";
import { isValidLimit, isValidSectionStartingCharacter } from "./utils";
import { limitFlow, tokenizerFlows } from "./flows";
import { getNextNonSpaceCharIndex } from "@packages/utils";

type TokenizerArgs = {
  input: string;
  isAnExpression?: boolean;
};

export const tokenizer = ({ input, isAnExpression }: TokenizerArgs) => {
  let errorMessage: string | undefined;

  try {
    const tokens: BaseToken[] = [];
    let duplicatedInput = input.slice();

    let currentIndex = 0;
    const { skippedIndexes } = getNextNonSpaceCharIndex({ input: duplicatedInput });
    if (skippedIndexes !== undefined) {
      currentIndex += skippedIndexes;
      duplicatedInput = duplicatedInput.slice(skippedIndexes);
    }

    if (duplicatedInput.length > 0) {
      isValidSectionStartingCharacter({ input: duplicatedInput, currentIndex, isAnExpression });
    }

    while (
      !isAnExpression &&
      duplicatedInput.length > 0 &&
      isValidLimit({ input: duplicatedInput })
    ) {
      const {
        tokens: parsedTokens,
        newInput,
        updatedIndex,
      } = limitFlow({ input: duplicatedInput, currentIndex });
      if (updatedIndex !== undefined) {
        tokens.push(...parsedTokens);
        duplicatedInput = newInput;
        currentIndex = updatedIndex;
      }
    }

    if (tokens.length > 0 && duplicatedInput.length === 0) {
      throw new Error(
        `The input ended unexpectedly when expecting a function value after creating a limit.`,
      );
    }

    while (duplicatedInput.length > 0) {
      const { newInput, updatedIndex } = tokenizerFlows({
        tokens,
        input: duplicatedInput,
        currentIndex,
        isAnExpression,
      });

      if (newInput !== undefined && updatedIndex !== undefined) {
        duplicatedInput = newInput;
        currentIndex = updatedIndex;
      } else {
        console.log(`Stopped at: ${duplicatedInput}`);
        throw new Error(
          `Encountered unsupported character ${duplicatedInput.charAt(0)} on index ${currentIndex}.`,
        );
      }
    }
    return { tokens, errorMessage };
  } catch (error) {
    const isError = error instanceof Error;
    errorMessage = `${isError ? error.message : error}`;
    return { tokens: [], errorMessage };
  }
};
