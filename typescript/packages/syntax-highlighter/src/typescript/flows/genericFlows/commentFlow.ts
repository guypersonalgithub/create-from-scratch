import { TokenTypes } from "../../constants";
import { BaseToken } from "../../types";

type CommentFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
};

export const commentFlow = ({ tokens, newTokenValue, input, currentIndex }: CommentFlowArgs) => {
  const nextChar = input[currentIndex];
  if (newTokenValue !== "/" || (nextChar !== "/" && nextChar !== "*")) {
    return;
  }

  let comment = newTokenValue + nextChar;
  let endCondition = nextChar === "/" ? "\n" : "*/";

  currentIndex++;

  if (nextChar === "/") {
    let currentChar = input[currentIndex];
    while (currentIndex < input.length && currentChar !== endCondition) {
      comment += currentChar;
      currentIndex++;
      currentChar = input[currentIndex];
    }
  } else {
    let currentChars = input.slice(currentIndex, currentIndex + 2);
    while (currentIndex < input.length && currentChars !== endCondition) {
      comment += currentChars[0];
      currentIndex++;
      currentChars = input.slice(currentIndex, currentIndex + 2);
    }

    if (currentIndex < input.length) {
      comment += endCondition;
      currentIndex += 2;
    }
  }

  tokens.push({ type: TokenTypes.COMMENT, value: comment });

  return {
    updatedIndex: currentIndex,
    stop: false,
  };
};
