import type { Callback } from "../types";
import { findNextBreakpoint, spaceCallback } from "../utils";

export const templateLiteralExpressionFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  cssInJS,
  extensionParsing,
}: Callback) => {
  if (!cssInJS || newTokenValue !== "$") {
    return;
  }

  const followupValue = findNextBreakpoint({ input, currentIndex });
  if (followupValue.newTokenValue !== "{") {
    return;
  }

  let amountOfCurlyBrackets = 1;

  let value = "${";

  let followup = spaceCallback({ input, currentIndex: followupValue.updatedIndex });
  while (followup.updatedIndex < input.length) {
    if (followup.skipped) {
      value += followup.skipped;
    }

    value += followup.newTokenValue;

    if (followup.newTokenValue === "{") {
      amountOfCurlyBrackets++;
    } else if (followup.newTokenValue === "}") {
      amountOfCurlyBrackets--;
    }

    if (amountOfCurlyBrackets === 0) {
      break;
    }

    followup = spaceCallback({ input, currentIndex: followup.updatedIndex });
  }

  if (!extensionParsing) {
    // TODO: Add typescript parsing here.
  }

  return { updatedIndex: followup.updatedIndex };
};
