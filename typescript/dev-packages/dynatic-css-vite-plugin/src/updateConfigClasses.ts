import type { DynaticConfiguration } from "@packages/dynatic-css";
import { detectObjectEnd } from "@packages/dynatic-css-typescript-parser";
import { replaceSubstring } from "@packages/string-utils";
// import { formatCodeWithPrettier } from "@packages/prettier";

type UpdateConfigClassesArgs = {
  fileText: string;
  config: DynaticConfiguration;
  configObjectStartIndex: number;
};

export const updateConfigClasses = ({
  fileText,
  config,
  configObjectStartIndex,
}: UpdateConfigClassesArgs) => {
  const { endIndex } = detectObjectEnd({
    input: fileText,
    startIndex: configObjectStartIndex + 1,
  });

  let updatedConfigString = "{\n";
  updatedConfigString = recursivelyIterateOverVariables({ config, updatedConfigString });
  updatedConfigString += "}";

  const updatedFileText = replaceSubstring({
    str: fileText,
    from: configObjectStartIndex,
    to: endIndex + 1,
    newStr: updatedConfigString,
  });

  return updatedFileText
};

type RecursivelyIterateOverVariablesArgs = {
  config: Record<string, unknown>;
  updatedConfigString: string;
};

const recursivelyIterateOverVariables = ({
  config,
  updatedConfigString,
}: RecursivelyIterateOverVariablesArgs) => {
  for (const property in config) {
    const value = config[property];

    if (typeof value !== "string" && typeof value !== "number") {
      updatedConfigString += `  "${property}": {\n`;
      updatedConfigString = recursivelyIterateOverVariables({
        config: value as Record<string, unknown>,
        updatedConfigString,
      });
      updatedConfigString += "  },\n";
    } else {
      updatedConfigString += `  "${property}": "${value}",\n`;
    }
  }

  return updatedConfigString;
};
