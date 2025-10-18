import { spaceFlow } from "./spaceFlow";
import type { Callback } from "./types";
import { findNextBreakpoint } from "./utils";

type Return = { updatedIndex: number } | undefined;

export const commentFlow = ({
  input,
  currentIndex,
  newTokenValue,
}: Omit<Callback, "exports">): Return => {
  const nextChar = input[currentIndex];
  if (newTokenValue !== "/" || (nextChar !== "/" && nextChar !== "*")) {
    return;
  }

  const endCondition = nextChar === "/" ? "\n" : "*/";

  currentIndex++;

  if (nextChar === "/") {
    let currentChar = input[currentIndex];
    while (currentIndex < input.length && currentChar !== endCondition) {
      currentIndex++;
      currentChar = input[currentIndex];
    }
  } else {
    let currentChars = input.slice(currentIndex, currentIndex + 2);
    while (currentIndex < input.length && currentChars !== endCondition) {
      currentIndex++;
      currentChars = input.slice(currentIndex, currentIndex + 2);
    }

    if (currentIndex < input.length) {
      currentIndex += 2;
    }
  }

  const breakpoint = findNextBreakpoint({ input, currentIndex });
  const space = spaceFlow({
    input,
    newTokenValue: breakpoint.newTokenValue,
    currentIndex: breakpoint.updatedIndex,
  });

  if (space) {
    const breakpoint = findNextBreakpoint({ input, currentIndex: space.updatedIndex });
    const comment = commentFlow({
      input,
      currentIndex: breakpoint.updatedIndex,
      newTokenValue: breakpoint.newTokenValue,
    });

    if (comment) {
      return { updatedIndex: comment.updatedIndex };
    }

    return { updatedIndex: space.updatedIndex };
  }

  return { updatedIndex: currentIndex };
};
