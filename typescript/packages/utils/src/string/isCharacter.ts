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

type IsChharacterUpperCaseArgs = {
  currentChar: string;
};

export const isCharacterUpperCase = ({ currentChar }: IsChharacterUpperCaseArgs) => {
  return currentChar.length === 1 && currentChar >= "A" && currentChar <= "Z";
};
