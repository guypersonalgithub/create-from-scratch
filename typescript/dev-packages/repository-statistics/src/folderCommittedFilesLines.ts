import { countFilesLines } from "@packages/files";
import { folderCommittedFiles } from "./folderCommittedFiles";

type FolderCommittedFilesLinesArgs = {
  folderPath: string;
  fileTypes?: string[];
};

export const folderCommittedFilesLines = async ({
  folderPath,
  fileTypes,
}: FolderCommittedFilesLinesArgs) => {
  const files = await folderCommittedFiles({ folderPath, fileTypes });
  return countFilesLines({ files });
};
