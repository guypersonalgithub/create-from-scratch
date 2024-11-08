import { uniqueWords } from "./uniqueTokens";

type GetUniqueTokenArgs = {
  input: string;
};

export const getUniqueToken = ({ input }: GetUniqueTokenArgs) => {
  let tokenValue: string = "";
  let currentInput = input.slice();

  while (
    currentInput.length > 0 &&
    (uniqueWords.find((unique) => unique.includes(tokenValue + currentInput.at(0))) ||
      tokenValue.length === 0)
  ) {
    // TODO: consider turning it into a string utility function.
    const currentChar = currentInput.at(0);
    currentInput = currentInput.slice(1);

    tokenValue += currentChar;
  }

  return uniqueWords.includes(tokenValue) ? tokenValue : "";
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
  i: number;
};

export const getNextNonSpaceCharIndex = ({ input, i }: GetNextNonSpaceCharIndexArgs) => {
  while (i < input.length && input[i + 1] === " ") {
    i++;
  }
  if (i === input.length) {
    return;
  }

  return i;
};
