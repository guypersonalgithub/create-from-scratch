import path from "path";

export const getProjectRelativePath = () => {
  const currentDirectory = process.cwd();
  const rootPath = path.resolve(currentDirectory);
  return rootPath;
};
