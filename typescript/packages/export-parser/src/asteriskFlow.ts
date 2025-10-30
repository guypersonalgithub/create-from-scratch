import { isAlphaNumeric } from "@packages/string-utils";
import type { Callback } from "./types";
import { spaceCallback } from "./utils";
import { fromExportFlow } from "./fromExportFlow";

export const asteriskFlow = ({ input, currentIndex, exports }: Omit<Callback, "newTokenValue">) => {
  let followup = spaceCallback({ input, currentIndex });
  let asExport: string | undefined;

  if (followup.newTokenValue === "as") {
    followup = spaceCallback({ input, currentIndex: followup.updatedIndex });
    if (!isAlphaNumeric({ str: followup.newTokenValue })) {
      return;
    }

    asExport = followup.newTokenValue;
    currentIndex = followup.updatedIndex;
  }

  const response = fromExportFlow({ input, currentIndex, exports });
  if (!response) {
    return;
  }

  const { updatedIndex } = response;

  if (asExport) {
    const { value } = response;

    if (!exports[value].as) {
      exports[value].as = new Set<string>();
    }

    exports[value].as.add(asExport);
  }

  return { updatedIndex };
};
