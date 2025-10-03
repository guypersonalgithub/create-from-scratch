import { TokenTypes } from "../constants";
import type { Callback } from "../types";
import { spaceCallback } from "../utils";

type ClassNameFlowArgs = Callback & {
  startIndex: number;
  isUnknown?: boolean;
};

export const classNameFlow = ({
  tokens,
  newTokenValue,
  input,
  startIndex,
  currentIndex,
  // extensionParsing,
  isUnknown,
}: ClassNameFlowArgs) => {
  // if (newTokenValue !== "&" && newTokenValue !== ".") {
  //   return;
  // }

  let endIndex = currentIndex;
  let value = newTokenValue;

  let followup = spaceCallback({ input, currentIndex });
  if (followup.skipped && followup.newTokenValue !== "{") {
    value += followup.skipped;
    endIndex += followup.skipped.length;
  }

  while (input.length > followup.updatedIndex && followup.newTokenValue !== "{") {
    value += followup.newTokenValue;
    endIndex = followup.updatedIndex;
    followup = spaceCallback({ input, currentIndex: followup.updatedIndex });

    if (followup.skipped) {
      // consider removing the last space and placing it as its own space token assuming followup.newTokenValue === "{"
      value += followup.skipped;
      endIndex += followup.skipped.length;
    }
  }

  tokens.push({
    type: isUnknown ? TokenTypes.UNKNOWN : TokenTypes.CLASSNAME,
    value,
    startIndex,
    endIndex,
  });

  // if (!extensionParsing) {
  tokens.push({
    type: TokenTypes.OPEN_CURLY_BRACKET,
    value: followup.newTokenValue,
    startIndex: followup.updatedIndex - 1,
    endIndex: followup.updatedIndex,
  });
  // }

  return { updatedIndex: followup.updatedIndex };
};
