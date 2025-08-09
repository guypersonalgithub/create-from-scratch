import type { Callback } from "./types";
import { findNextBreakpoint } from "./utils";

export const commentLineFlow = ({ input, currentIndex, newTokenValue }: Callback) => {
  const next = findNextBreakpoint({ input, currentIndex });

  if (next.newTokenValue === "/") {
    currentIndex = next.updatedIndex;

    let followup = findNextBreakpoint({ input, currentIndex });
    currentIndex = followup.updatedIndex;
    while (followup.newTokenValue !== "\n" && currentIndex < input.length) {
      followup = findNextBreakpoint({ input, currentIndex });
      currentIndex = followup.updatedIndex;
    }
  } else if (next.newTokenValue === "*") {
    let followup = findNextBreakpoint({ input, currentIndex });
    currentIndex = followup.updatedIndex;
    while (
      followup.newTokenValue !== "*" &&
      input[currentIndex] !== "/" &&
      currentIndex < input.length
    ) {
      followup = findNextBreakpoint({ input, currentIndex });
      currentIndex = followup.updatedIndex;
    }
  }

  return { updatedIndex: currentIndex };
};
