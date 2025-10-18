import { isAlphaNumeric } from "@packages/utils";
import { asteriskFlow } from "./asteriskFlow";
import { fullTypeFlow } from "./fullTypeFlow";
import type { Callback, ExportProperties } from "./types";
import { spaceCallback } from "./utils";
import { fromExportFlow } from "./fromExportFlow";

export const exportFlow = ({
  input,
  currentIndex,
  newTokenValue,
  exports,
  includeTypes,
}: Callback) => {
  // TODO: Include type mapping when includeTypes = true.
  if (newTokenValue !== "export") {
    return;
  }

  let followup = spaceCallback({ input, currentIndex });
  if (followup.newTokenValue === "type") {
    return fullTypeFlow({ input, currentIndex: followup.updatedIndex, exports, includeTypes });
  }

  if (followup.newTokenValue === "*") {
    return asteriskFlow({ input, currentIndex: followup.updatedIndex, exports });
  }

  let exportDefault: string | undefined;

  if (isAlphaNumeric({ str: followup.newTokenValue })) {
    exportDefault = followup.newTokenValue;

    followup = spaceCallback({ input, currentIndex: followup.updatedIndex });
    if (followup.newTokenValue !== ",") {
      const response = fromExportFlow({ input, currentIndex: followup.updatedIndex, exports });
      if (!response) {
        return;
      }

      const { updatedIndex, value } = response;

      if (!exports[value].exportDefault) {
        exports[value].exportDefault = new Set<string>();
      }

      exports[value].exportDefault.add(exportDefault);

      return { updatedIndex };
    }

    followup = spaceCallback({ input, currentIndex: followup.updatedIndex });
  }

  if (followup.newTokenValue !== "{") {
    return;
  }

  const currentExports: ExportProperties[] = [];
  const takenExports = new Set<string>();

  followup = spaceCallback({ input, currentIndex: followup.updatedIndex });

  while (input.length > currentIndex && followup.newTokenValue !== "}") {
    let isTypeImport = followup.newTokenValue === "type";

    if (isTypeImport) {
      followup = spaceCallback({ input, currentIndex: followup.updatedIndex });
    }

    if (!isAlphaNumeric({ str: followup.newTokenValue })) {
      return;
    }

    let name = followup.newTokenValue;
    followup = spaceCallback({ input, currentIndex: followup.updatedIndex });
    let rename: string | undefined;

    if (followup.newTokenValue === ",") {
      if (!takenExports.has(name) && !isTypeImport) {
        takenExports.add(name);
        currentExports.push({ name });
      }

      followup = spaceCallback({ input, currentIndex: followup.updatedIndex });
      continue;
    } else if (followup.newTokenValue === "}") {
      if (!takenExports.has(name) && !isTypeImport) {
        takenExports.add(name);
        currentExports.push({ name });
      }

      break;
    } else if (followup.newTokenValue === "as") {
      followup = spaceCallback({ input, currentIndex: followup.updatedIndex });

      if (!isAlphaNumeric({ str: followup.newTokenValue })) {
        return;
      }

      rename = followup.newTokenValue;

      followup = spaceCallback({ input, currentIndex: followup.updatedIndex });
      if (followup.newTokenValue === ",") {
        const mix = `${name}-${rename}`;
        if (!takenExports.has(mix) && !isTypeImport) {
          takenExports.add(mix);
          currentExports.push({ name, rename });
        }

        followup = spaceCallback({ input, currentIndex: followup.updatedIndex });
      } else if (followup.newTokenValue === "}") {
        const mix = `${name}-${rename}`;
        if (!takenExports.has(mix) && !isTypeImport) {
          takenExports.add(mix);
          currentExports.push({ name, rename });

          break;
        }
      } else {
        return;
      }
    } else {
      break;
    }
  }

  const response = fromExportFlow({ input, currentIndex: followup.updatedIndex, exports });
  if (!response) {
    return;
  }

  const { updatedIndex, value } = response;

  if (!exports[value].exports) {
    exports[value].exports = currentExports;
  } else {
    exports[value].exports = [...exports[value].exports, ...currentExports];
  }

  if (!exports[value].takenExports) {
    exports[value].takenExports = takenExports;
  } else {
    takenExports.forEach((takenExport) => {
      exports[value].takenExports!.add(takenExport);
    });
  }

  if (exportDefault) {
    if (!exports[value].exportDefault) {
      exports[value].exportDefault = new Set<string>();
    }

    exports[value].exportDefault.add(exportDefault);
  }

  return { updatedIndex };
};
