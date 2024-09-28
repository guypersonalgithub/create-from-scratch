import { executeTerminalCommandWithResponse } from "@packages/terminal-utils";

export const detectFileChangesSinceLastCommit = async () => {
  const fileChangesString = await executeTerminalCommandWithResponse({
    command: "git diff --name-only HEAD",
  });

  const changedFiles = fileChangesString?.split("\n").filter((line) => line.length > 0);
  return changedFiles;
};
