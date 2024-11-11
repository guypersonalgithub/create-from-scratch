import { BaseToken } from "./types";
import { getNextNonSpaceCharIndex, isValidSectionStartingCharacter } from "./utils";
import { tokenizerFlows } from "./flows";

type TokenizerArgs = {
  input: string;
};

export const tokenizer = ({ input }: TokenizerArgs) => {
  const tokens: BaseToken[] = [];

  try {
    let duplicatedInput = input.slice();

    let currentIndex = 0;
    const { skippedIndexes } = getNextNonSpaceCharIndex({ input: duplicatedInput });
    if (skippedIndexes !== undefined) {
      currentIndex += skippedIndexes;
      duplicatedInput = duplicatedInput.slice(skippedIndexes);
    }
    isValidSectionStartingCharacter({ input: duplicatedInput, currentIndex });

    while (duplicatedInput.length > 0) {
      const { newInput, updatedIndex } = tokenizerFlows({
        tokens,
        input: duplicatedInput,
        currentIndex,
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
  } catch (error) {
    console.error(error);
  }

  return tokens;
};
