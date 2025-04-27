import { readdirSync } from "fs";

type GetAmountOfFoldersArgs = {
  path: string;
};

export const getAmountOfFolders = ({ path }: GetAmountOfFoldersArgs) => {
  const files = readdirSync(path, { withFileTypes: true });

  return files.reduce((sum, current) => {
    const isFolder = current.isDirectory();
    if (isFolder) {
      return sum + 1;
    }

    return sum;
  }, 0);
};
