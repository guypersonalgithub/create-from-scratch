import { stringDefinitions } from "./constants";

type StringFlowArgs = {
  input: string;
  currentIndex: number;
  newTokenValue: string;
  isObjectKey?: boolean;
};

export const stringFlow = ({ input, currentIndex, newTokenValue, isObjectKey }: StringFlowArgs) => {
  if (!newTokenValue) {
    return { updatedIndex: currentIndex };
  }

  if (!stringDefinitions.has(newTokenValue)) {
    return { updatedIndex: currentIndex };
  }

  let completeValue = newTokenValue;
  const quotationSign = newTokenValue;

  while (currentIndex < input.length) {
    const current = input[currentIndex];

    if (current === "\\") {
      const followingCharacter = input[currentIndex + 1];
      if (followingCharacter === quotationSign) {
        completeValue += `${current}${followingCharacter}`;
        currentIndex += 2;
        continue;
      }
    } else if (current === quotationSign) {
      completeValue += current;
      currentIndex++;
      break;
    } else if (current === "\n") {
      completeValue += current;
      currentIndex++;
      break;
    }

    completeValue += current;
    currentIndex++;
  }

  return { updatedIndex: currentIndex, value: completeValue };
};
