import { readFileSync } from "fs";
import { getNextNonSpaceCharIndex } from "@packages/utils";

type GetExportDefaultIndexArgs = {
  folderPath: string;
  fileName: string;
};

export const getExportDefaultIndex = ({ folderPath, fileName }: GetExportDefaultIndexArgs) => {
  try {
    const exportDefaultIdentifier = "export default";
    const filePath = `${folderPath}/${fileName}`;
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
      filePath,
      file,
      startingIndex,
      isObject,
      isFunction,
    };
  } catch (error) {
    return {};
  }
};
