import { executeTerminalCommandWithResponse } from "../typescript/dev-packages/terminal-utils/src";

const getRepositoryFileCount = async () => {
  const filesString = await executeTerminalCommandWithResponse({
    command: "git ls-files",
  });
  const files = filesString?.trim()?.split("\n") ?? [];
  console.log(`Number of files: ${files.length}`);
};

getRepositoryFileCount();
