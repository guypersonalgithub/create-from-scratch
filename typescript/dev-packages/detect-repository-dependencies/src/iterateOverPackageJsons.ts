import { getProjectAbsolutePath } from "@packages/paths";
import { getConfigFileData } from "./getConfigFileData";
import { mapPackageJsonDependencies } from "./mapPackageJsonDependencies";

type IterateOverPackageJsonsArgs = {
  packageJsonPaths: string[];
};

export const iterateOverPackageJsons = ({ packageJsonPaths }: IterateOverPackageJsonsArgs) => {
  const projectAbsolutePath = getProjectAbsolutePath();
  const config = getConfigFileData({ projectAbsolutePath });
  const { packageIdentifiers } = config;

  return mapPackageJsonDependencies({
    packageJsonPaths,
    projectAbsolutePath,
    packageIdentifiers,
  }).dependenciesMap;
};
