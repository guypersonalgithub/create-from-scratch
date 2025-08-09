type DetectObjectEndArgs = {
  input: string;
  startIndex: number;
};

export const detectObjectEnd = ({ input, startIndex }: DetectObjectEndArgs) => {
  let brackets = 1;
  let currentIndex = startIndex;

  while (input.length > currentIndex && brackets > 0) {
    const current = input[currentIndex];

    if (current === "{") {
      brackets++;
    } else if (current === "}") {
      brackets--;
    }

    currentIndex++;
  }

  return {
    startIndex,
    endIndex: currentIndex,
  };
};
