import { TokenTypes } from "~/tokenizer/constants";
import { isValidSectionStartingCharacter } from "~/tokenizer/utils";
import { getNextNonSpaceCharIndex } from "@packages/utils";

type PowerFlowArgs = {
  input: string;
  currentIndex: number;
  isAnExpression?: boolean;
};

export const powerFlow = ({ input, currentIndex, isAnExpression }: PowerFlowArgs) => {
  let duplicatedInput = input.slice(1);
  currentIndex++;
  const { skippedIndexes } = getNextNonSpaceCharIndex({ input: duplicatedInput });
  if (skippedIndexes !== undefined) {
    currentIndex += skippedIndexes;
    duplicatedInput = duplicatedInput.slice(skippedIndexes);
  }
  isValidSectionStartingCharacter({ input: duplicatedInput, currentIndex, isAnExpression });

  const token = {
    type: TokenTypes.UNIQUE_OPERATION,
    value: "^",
  };

  return {
    token,
    newInput: duplicatedInput,
    updatedIndex: currentIndex,
  };
};
