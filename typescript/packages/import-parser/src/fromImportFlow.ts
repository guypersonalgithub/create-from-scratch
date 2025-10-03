import { stringDefinitions } from "./constants";
import { stringFlow } from "./stringFlow";
import type { Callback } from "./types";
import { spaceCallback } from "./utils";

export const fromImportFlow = ({
  input,
  currentIndex,
  imports,
}: Omit<Callback, "newTokenValue">) => {
  let followup = spaceCallback({ input, currentIndex });

  if (followup.newTokenValue !== "from") {
    return;
  }

  followup = spaceCallback({ input, currentIndex: followup.updatedIndex });

  if (!stringDefinitions.has(followup.newTokenValue)) {
    return;
  }

  const { updatedIndex, value } = stringFlow({
    input,
    currentIndex: followup.updatedIndex,
    newTokenValue: followup.newTokenValue,
  });

  if (!value) {
    return;
  }

  if (!imports[value]) {
    imports[value] = {};
  }

  followup = spaceCallback({ input, currentIndex: updatedIndex });
  if (followup.newTokenValue === ";") {
    return { updatedIndex: followup.updatedIndex, value };
  }

  return { updatedIndex, value };
};
