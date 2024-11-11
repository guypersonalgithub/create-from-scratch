import { nonStarterTokens } from "./uniqueTokens";

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
};

export const isValidSectionStartingCharacter = ({
  input,
  currentIndex,
}: IsValidSectionStartingCharacterArgs) => {
  const currentChar = input.charAt(0);
  const isValid = currentChar && !nonStarterTokens.has(currentChar) && currentChar !== ",";
  if (!isValid) {
    throw new Error(`Encountered an unexpected character ${currentChar} on index ${currentIndex}`);
  }
};
