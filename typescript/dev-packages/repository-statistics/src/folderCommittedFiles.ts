import { executeTerminalCommandWithResponse } from "@packages/terminal-utils";

type FolderCommittedFilesArgs = {
  folderPath: string;
  fileTypes?: string[];
};

export const folderCommittedFiles = async ({ folderPath, fileTypes }: FolderCommittedFilesArgs) => {
  const output =
    (await executeTerminalCommandWithResponse({ command: `git ls-files "${folderPath}"` })) ?? "";
  if (output.length === 0) {
    console.error(`Failed to find committed files on folder ${folderPath}`);
  }

  let files = output.split("\n").map((line) => line.trim());

  if (fileTypes) {
    files = files.filter((line) => line && fileTypes.some((fileType) => line.endsWith(fileType)));
  }

  return files;
};
