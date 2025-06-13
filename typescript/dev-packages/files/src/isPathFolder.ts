import { statSync } from "fs";

type IsPathFolderArgs = {
  path: string;
};

export const isPathFolder = ({ path }: IsPathFolderArgs) => {
  const stats = statSync(path);

  return stats.isDirectory();
};
