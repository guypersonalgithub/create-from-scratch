type ExtractObjectArgs = {
  file: string;
  startIndex: number;
};

export const extractObject = ({ file, startIndex }: ExtractObjectArgs) => {
  let objectParenthesisCount = 0;
  let start = file.slice(startIndex);
  let currentChar = start.charAt(0);
  if (currentChar !== "{") {
    throw new Error(`The given file didn't start with an object at index ${startIndex}`);
  }

  let obj = currentChar;
  objectParenthesisCount++;
  start = start.slice(1);

  while (start.length > 0 && objectParenthesisCount > 0) {
    currentChar = start.charAt(0);
    if (currentChar === "{") {
      objectParenthesisCount++;
    } else if (currentChar === "}") {
      objectParenthesisCount--;
    }

    obj += currentChar;
    start = start.slice(1);
  }

  if (objectParenthesisCount > 0) {
    throw new Error(
      `Went over the entire given file from given index ${startIndex} and didn't find the object's end.`,
    );
  }

  return {
    obj,
  };
};
