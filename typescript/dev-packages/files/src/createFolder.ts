import { existsSync, mkdirSync } from "fs";

type CreateFolderArgs = {
  path: string;
};

export const createFolder = ({ path }: CreateFolderArgs) => {
  const folderAlreadyExists = existsSync(path);
  if (!folderAlreadyExists) {
    mkdirSync(path);
  }
};
