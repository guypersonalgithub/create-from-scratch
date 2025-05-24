import { executeTerminalCommandWithResponse } from "@packages/terminal-utils";

export const getRepositoryFiles = async () => {
  const filesString = await executeTerminalCommandWithResponse({
    command: "git ls-files",
  });
  const files = filesString?.trim()?.split("\n") ?? [];
  return files;
};
