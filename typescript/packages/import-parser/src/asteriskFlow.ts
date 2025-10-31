import { isAlphaNumeric } from "@packages/string-utils";
import type { Callback } from "./types";
import { spaceCallback } from "./utils";
import { fromImportFlow } from "./fromImportFlow";

export const asteriskFlow = ({ input, currentIndex, imports }: Omit<Callback, "newTokenValue">) => {
  let followup = spaceCallback({ input, currentIndex });

  if (followup.newTokenValue !== "as") {
    return;
  }

  followup = spaceCallback({ input, currentIndex: followup.updatedIndex });

  if (!isAlphaNumeric({ str: followup.newTokenValue })) {
    return;
  }

  let asExport = followup.newTokenValue;

  const response = fromImportFlow({ input, currentIndex: followup.updatedIndex, imports });
  if (!response) {
    return;
  }

  const { updatedIndex, value } = response;

  if (!imports[value].as) {
    imports[value].as = new Set<string>();
  }

  imports[value].as.add(asExport);

  return { updatedIndex };
};
