import { nonStarterTokens } from "./uniqueTokens";
import { unicodes } from "./uniqueUnicodes";

type IsValidSectionStartingCharacterArgs = {
  input: string;
  currentIndex: number;
  isAnExpression?: boolean;
};

export const isValidSectionStartingCharacter = ({
  input,
  currentIndex,
  isAnExpression,
}: IsValidSectionStartingCharacterArgs) => {
  const currentChar = input.charAt(0);
  const isValid = currentChar && !nonStarterTokens.has(currentChar);
  const isFormulaValid = isAnExpression ? currentChar === unicodes.javascript.capitalDelta : false;
  if (!isValid && !isFormulaValid) {
    throw new Error(`Encountered an unexpected character ${currentChar} on index ${currentIndex}`);
  }
};

type IsValidLimitArgs = {
  input: string;
};

export const isValidLimit = ({ input }: IsValidLimitArgs) => {
  return input[0] === "l" && input[1] === "i" && input[2] === "m";
};
