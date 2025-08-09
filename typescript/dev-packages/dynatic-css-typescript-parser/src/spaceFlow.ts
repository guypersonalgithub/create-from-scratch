type SpaceFlowArgs = {
  input: string;
  newTokenValue: string;
  currentIndex: number;
};

export const spaceFlow = ({ input, newTokenValue = "", currentIndex }: SpaceFlowArgs) => {
  const firstChar = newTokenValue[0];
  if (firstChar !== " " && firstChar !== "\n" && firstChar !== "\r") {
    return;
  }

  let fullSpace = newTokenValue;

  while (
    (input[currentIndex] === " " || input[currentIndex] === "\n" || input[currentIndex] === "\r") &&
    currentIndex < input.length
  ) {
    const current = input[currentIndex];
    fullSpace += current;
    currentIndex++;
  }

  return { updatedIndex: currentIndex };
};
