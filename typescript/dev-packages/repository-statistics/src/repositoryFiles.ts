import { executeTerminalCommandWithResponse } from "@packages/terminal-utils";
import { readFileSync } from "fs";

type SupportedOptions = ".yaml" | ".json" | ".ts" | ".tsx" | ".js" | ".jsx" | ".env";

type GetRepositoryFilesArgs = {
  includeLineCountOf?: SupportedOptions[];
};

export const getRepositoryFiles = async (args?: GetRepositoryFilesArgs) => {
  const { includeLineCountOf } = args ?? {};

  const filesString = await executeTerminalCommandWithResponse({
    command: "git ls-files",
  });
  const files = filesString?.trim()?.split("\n") ?? [];

  if (includeLineCountOf && includeLineCountOf.length > 0) {
    const includedFiles = new Set(includeLineCountOf);

    const counter = files.reduce((sum, current) => {
      let fileTypeIndex = -1;

      for (let i = current.length - 1; i >= 0; i--) {
        const currentChar = current[i];
        if (currentChar === ".") {
          fileTypeIndex = i;
          break;
        }
      }

      if (fileTypeIndex !== -1) {
        const fileType = current.slice(fileTypeIndex);
        if (includedFiles.has(fileType as SupportedOptions)) {
          const file = readFileSync(current, { encoding: "utf-8" });
          return (sum += file.split("\n").length);
        }
      }

      return sum;
    }, 0);

    return { files, counter };
  }

  return { files };
};
