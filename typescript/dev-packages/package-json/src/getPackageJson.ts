import { type PackageJson } from "./types";
import { getFile } from "@packages/files";

type GetPackageJsonArgs = {
  folderPath: string;
};

export const getPackageJson = ({ folderPath }: GetPackageJsonArgs) => {
  try {
    const stringifiedPackageJson = getFile({ path: `${folderPath}/package.json` });
    if (!stringifiedPackageJson) {
      throw "The package json file was not found.";
    }
    const packageJson = JSON.parse(stringifiedPackageJson) as PackageJson;

    return packageJson;
  } catch (error) {
    console.error(error);
  }
};
