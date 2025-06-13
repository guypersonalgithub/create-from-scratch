type ReplaceOrInsertCharactersInRangeArgs = {
  str: string;
  startIndex: number;
  endIndex?: number;
  newChars: string;
};

export const replaceOrInsertCharactersInRange = ({
  str,
  startIndex,
  endIndex = startIndex,
  newChars,
}: ReplaceOrInsertCharactersInRangeArgs) => {
  let updatedStr = str.substring(0, startIndex) + newChars;

  if (startIndex === endIndex) {
    updatedStr += str.substring(endIndex);

    return updatedStr;
  }

  updatedStr += str.substring(endIndex + 1);

  return updatedStr;
};
