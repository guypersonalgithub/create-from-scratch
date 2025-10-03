import { TokenTypes } from "../constants";
import type { Callback } from "../types";
import { spaceCallback } from "../utils";
import { classNameFlow } from "./classNameFlow";

export const htmlTagFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  extensionParsing,
}: Callback) => {
  let isUnknown = false;
  let endIndex = currentIndex;
  let value = newTokenValue;

  const followup = spaceCallback({ input, currentIndex });
  const isFollowupCurlyBracket = followup.newTokenValue !== "{";

  if (followup.skipped && isFollowupCurlyBracket) {
    value += followup.skipped;
    endIndex += followup.skipped.length;
    isUnknown = true;
  }

  if (isFollowupCurlyBracket) {
    value += followup.newTokenValue;
    endIndex += followup.newTokenValue.length;
  }

  if (followup.isNumeric) {
    tokens.push({ type: TokenTypes.UNKNOWN, value, startIndex: currentIndex, endIndex });
    return;
  }

  return classNameFlow({
    tokens,
    newTokenValue: value,
    input,
    startIndex: currentIndex - value.length,
    currentIndex: endIndex,
    extensionParsing,
    isUnknown,
  });
};
