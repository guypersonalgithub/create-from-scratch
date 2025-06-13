import { readdirSync } from "fs";

type GetFoldersInPathArgs = {
  path: string;
};

export const getFoldersInPath = ({ path }: GetFoldersInPathArgs) => {
  const files = readdirSync(path, { withFileTypes: true });

  return files.filter((file) => file.isDirectory());
};
