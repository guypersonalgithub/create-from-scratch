import { getFoldersInPath } from "./getFoldersInPath";

type GetAmountOfFoldersArgs = {
  path: string;
};

export const getAmountOfFolders = ({ path }: GetAmountOfFoldersArgs) => {
  const folders = getFoldersInPath({ path });

  return folders.reduce((sum) => {
    return sum + 1;
  }, 0);
};
