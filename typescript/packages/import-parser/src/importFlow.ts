import { isAlphaNumeric } from "@packages/string-utils";
import { asteriskFlow } from "./asteriskFlow";
import { fullTypeFlow } from "./fullTypeFlow";
import type { Callback, ExportProperties } from "./types";
import { spaceCallback } from "./utils";
import { fromImportFlow } from "./fromImportFlow";
import { stringFlow } from "./stringFlow";

export const importFlow = ({
  input,
  currentIndex,
  newTokenValue,
  imports,
  includeTypes,
}: Callback) => {
  // TODO: Include type mapping when includeTypes = true.
  if (newTokenValue !== "import") {
    return;
  }

  let followup = spaceCallback({ input, currentIndex });
  if (followup.newTokenValue === "type") {
    return fullTypeFlow({ input, currentIndex: followup.updatedIndex, imports, includeTypes });
  }

  if (followup.newTokenValue === "*") {
    return asteriskFlow({ input, currentIndex: followup.updatedIndex, imports });
  }

  if (followup.newTokenValue === '"' || followup.newTokenValue === "'") {
    const { updatedIndex } = stringFlow({
      input,
      currentIndex: followup.updatedIndex,
      newTokenValue: followup.newTokenValue,
    });

    const end = spaceCallback({ input, currentIndex: updatedIndex });
    return { updatedIndex: end.newTokenValue === ";" ? end.updatedIndex : updatedIndex };
  }

  let exportDefault: string | undefined;

  if (isAlphaNumeric({ str: followup.newTokenValue })) {
    exportDefault = followup.newTokenValue;
    const currentIndex = followup.updatedIndex;

    followup = spaceCallback({ input, currentIndex: followup.updatedIndex });
    if (followup.newTokenValue !== ",") {
      const response = fromImportFlow({ input, currentIndex, imports });
      if (!response) {
        return;
      }

      const { updatedIndex, value } = response;

      if (!imports[value].exportDefault) {
        imports[value].exportDefault = new Set<string>();
      }

      imports[value].exportDefault.add(exportDefault);

      return { updatedIndex };
    }

    followup = spaceCallback({ input, currentIndex: followup.updatedIndex });
  }

  if (followup.newTokenValue !== "{") {
    return;
  }

  const exports: ExportProperties[] = [];
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
        exports.push({ name });
      }

      followup = spaceCallback({ input, currentIndex: followup.updatedIndex });
      continue;
    } else if (followup.newTokenValue === "}") {
      if (!takenExports.has(name) && !isTypeImport) {
        takenExports.add(name);
        exports.push({ name });
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
          exports.push({ name, rename });
        }

        followup = spaceCallback({ input, currentIndex: followup.updatedIndex });
      } else if (followup.newTokenValue === "}") {
        const mix = `${name}-${rename}`;
        if (!takenExports.has(mix) && !isTypeImport) {
          takenExports.add(mix);
          exports.push({ name, rename });

          break;
        }
      } else {
        return;
      }
    } else {
      break;
    }
  }

  const response = fromImportFlow({ input, currentIndex: followup.updatedIndex, imports });
  if (!response) {
    return;
  }

  const { updatedIndex, value } = response;

  if (!imports[value].exports) {
    imports[value].exports = exports;
  } else {
    imports[value].exports = [...imports[value].exports, ...exports];
  }

  if (!imports[value].takenExports) {
    imports[value].takenExports = takenExports;
  } else {
    takenExports.forEach((takenExport) => {
      imports[value].takenExports!.add(takenExport);
    });
  }

  if (exportDefault) {
    if (!imports[value].exportDefault) {
      imports[value].exportDefault = new Set<string>();
    }

    imports[value].exportDefault.add(exportDefault);
  }

  return { updatedIndex };
};
