import { extractObject, getExportDefaultIndex } from "@packages/typescript-file-manipulation";
import { convertStringToObjectWithStringProperties } from "@packages/object-utils";
import { type ActionYamlConfigProps } from "./types";
// import { getModuleExports } from "@packages/files";

type GetConfigurationArgs = {
  filePath: string;
};

export const getConfiguration = ({ filePath }: GetConfigurationArgs) => {
  const { file, startingIndex, isObject } = getExportDefaultIndex({
    filePath,
  });

  if (!file) {
    return;
  }

  if (!isObject) {
    console.error("Expected to find an export default object.");

    return;
  }

  const { obj } = extractObject({ file, startIndex: startingIndex });
  const { object } = convertStringToObjectWithStringProperties({
    str: obj,
    removeKeyQuotations: true,
    removeValueQuotations: true,
  });

  return object as ActionYamlConfigProps;
  // const module = await getModuleExports({ filePath });
  // const defaultExport = module.default;
  // return defaultExport as ActionYamlConfigProps;
};
