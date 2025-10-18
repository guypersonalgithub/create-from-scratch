import { stringDefinitions } from "./constants";
import type { Callback } from "./types";

export const stringFlow = ({ input, currentIndex, newTokenValue }: Omit<Callback, "imports">) => {
  if (!newTokenValue || !stringDefinitions.has(newTokenValue)) {
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

  completeValue = completeValue.slice(1, completeValue.length - 1);

  return { updatedIndex: currentIndex, value: completeValue };
};
