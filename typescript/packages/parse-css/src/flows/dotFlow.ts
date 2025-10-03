import type { Callback } from "../types";
import { spaceCallback } from "../utils";
import { classNameFlow } from "./classNameFlow";
import { numericValueFlow } from "./numericValueFlow";

export const dotFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  extensionParsing,
}: Callback) => {
  if (newTokenValue !== ".") {
    return;
  }

  let isUnknown = false;
  let endIndex = currentIndex;
  let value = newTokenValue;

  const followup = spaceCallback({ input, currentIndex });

  if (followup.skipped) {
    value += followup.skipped;
    endIndex += followup.skipped.length;
    isUnknown = true;
  }

  value += followup.newTokenValue;
  endIndex += followup.newTokenValue.length;

  if (followup.isNumeric) {
    return numericValueFlow({
      tokens,
      newTokenValue: value,
      input,
      startIndex: currentIndex,
      currentIndex: endIndex,
      extensionParsing,
      isUnknown,
      isNested: true,
    });
  }

  return classNameFlow({
    tokens,
    newTokenValue: value,
    input,
    startIndex: currentIndex,
    currentIndex: endIndex,
    extensionParsing,
    isUnknown,
  });
};
