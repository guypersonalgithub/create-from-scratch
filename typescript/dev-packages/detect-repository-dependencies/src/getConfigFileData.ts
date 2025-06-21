import { type ConfigProperties } from "./types";
import { extractObject, getExportDefaultIndex } from "@packages/typescript-file-manipulation";
import { convertStringToObjectWithStringProperties } from "@packages/object-utils";

type GetConfigFileDataArgs = {
  projectAbsolutePath: string;
};

export const getConfigFileData = ({ projectAbsolutePath }: GetConfigFileDataArgs) => {
  try {
    const { file, startingIndex, isObject } = getExportDefaultIndex({
      filePath: `${projectAbsolutePath}/dependencies.config.ts`,
    });

    if (!file) {
      return {};
    }

    if (!isObject) {
      console.error("Expected to find an export default object.");

      return {};
    }

    const { obj } = extractObject({ file, startIndex: startingIndex });
    const { object } = convertStringToObjectWithStringProperties({
      str: obj,
      removeKeyQuotations: true,
      removeValueQuotations: true,
    });

    return object as ConfigProperties;
  } catch (error) {
    return {};
  }
};
