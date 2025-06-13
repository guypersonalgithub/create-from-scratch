import { readFileSync } from "fs";
import { getNextNonSpaceCharIndex } from "@packages/utils";

type GetExportDefaultIndexArgs = {
  filePath: string;
};

export const getExportDefaultIndex = ({ filePath }: GetExportDefaultIndexArgs) => {
  try {
    const exportDefaultIdentifier = "export default";
    const file = readFileSync(filePath, {
      encoding: "utf-8",
      flag: "r",
    });
    const exportDefaultIndex = file.indexOf(exportDefaultIdentifier);
    if (exportDefaultIndex === -1) {
      return {};
    }

    const afterExportDefaultIndex = exportDefaultIndex + exportDefaultIdentifier.length;
    const fileBeyondExportDefault = file.slice(afterExportDefaultIndex);
    const { skippedIndexes } = getNextNonSpaceCharIndex({ input: fileBeyondExportDefault });
    if (skippedIndexes === undefined) {
      return {};
    }

    let startingIndex = afterExportDefaultIndex + skippedIndexes;
    let isObject = false;
    let isFunction = false;
    const fileLength = file.length;
    while (fileLength > startingIndex) {
      const current = file[startingIndex];
      if (current === "{") {
        isObject = true;
        break;
      } else if (current === "(") {
        isFunction = true;
        break;
      }

      startingIndex++;
    }

    return {
      file,
      startingIndex,
      isObject,
      isFunction,
    };
  } catch (error) {
    return {};
  }
};
