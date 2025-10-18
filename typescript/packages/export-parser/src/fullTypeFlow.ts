import { stringDefinitions } from "./constants";
import { stringFlow } from "./stringFlow";
import type { Callback } from "./types";
import { spaceCallback } from "./utils";

export const fullTypeFlow = ({
  input,
  currentIndex,
  exports,
  includeTypes,
}: Omit<Callback, "newTokenValue">) => {
  let followup = spaceCallback({ input, currentIndex });

  if (!includeTypes) {
    while (
      input.length > currentIndex &&
      !stringDefinitions.has(followup.newTokenValue) &&
      // exporting type definitions is irrelevant while includeTypes is false.
      followup.newTokenValue !== "="
    ) {
      followup = spaceCallback({ input, currentIndex: followup.updatedIndex });
    }
  } else {
    // TODO: Add type mapping
  }

  const { updatedIndex } = stringFlow({
    input,
    currentIndex: followup.updatedIndex,
    newTokenValue: followup.newTokenValue,
  });

  followup = spaceCallback({ input, currentIndex: updatedIndex });

  if (followup.newTokenValue === ";") {
    return { updatedIndex: followup.updatedIndex };
  }

  return { updatedIndex };
};
