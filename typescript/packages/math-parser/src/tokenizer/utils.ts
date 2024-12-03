import { nonStarterTokens } from "./uniqueTokens";
import { unicodes } from "./uniqueUnicodes";

type IsCharacterNumberArgs = {
  currentChar: string;
};

export const isCharacterNumber = ({ currentChar }: IsCharacterNumberArgs) => {
  if (!currentChar) {
    return false;
  }

  return !isNaN(Number.parseFloat(currentChar));
};

type IsCharacterLetterArgs = {
  currentChar: string;
};

export const isCharacterLetter = ({ currentChar }: IsCharacterLetterArgs) => {
  if (!currentChar) {
    return false;
  }

  const characterCode = currentChar.charCodeAt(0);
  return (characterCode > 64 && characterCode < 91) || (characterCode > 96 && characterCode < 123);
};

type GetNextNonSpaceCharIndexArgs = {
  input: string;
};

export const getNextNonSpaceCharIndex = ({ input }: GetNextNonSpaceCharIndexArgs) => {
  let skippedIndexes = 0;

  while (skippedIndexes < input.length && input[skippedIndexes] === " ") {
    skippedIndexes++;
  }

  if (skippedIndexes === input.length) {
    return {};
  }

  return {
    skippedIndexes,
  };
};

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
  const isValid =
    currentChar && !nonStarterTokens.has(currentChar);
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
