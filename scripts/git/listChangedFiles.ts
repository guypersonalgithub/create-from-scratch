import { executeTerminalCommandWithResponse } from "../terminal";

export const listChangedFiles = async () => {
  const fileChangesString = await executeTerminalCommandWithResponse({
    command: "git status --porcelain",
  });
  if (!fileChangesString) {
    return;
  }

  const changedFiles = fileChangesString
    .split("\n")
    .filter((line) => line.length > 0)
    .map((fileRow) => {
      const status = fileRow.slice(0, 2).trim();
      const file = fileRow.slice(3).trim();

      return {
        status,
        file,
      };
    });

  return changedFiles;
};
