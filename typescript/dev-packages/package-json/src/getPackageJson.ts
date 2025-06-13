import { type PackageJson } from "./types";
import { getFile } from "@packages/files";

type GetPackageJsonArgs = {
  packagePath: string;
};

export const getPackageJson = ({ packagePath }: GetPackageJsonArgs) => {
  try {
    const stringifiedPackageJson = getFile({ path: `${packagePath}/package.json` });
    if (!stringifiedPackageJson) {
      throw "The package json file was not found.";
    }
    const packageJson = JSON.parse(stringifiedPackageJson) as PackageJson;

    return packageJson;
  } catch (error) {
    console.error(error);
  }
};
