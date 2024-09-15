import { getFile } from "@packages/files";
import { detectRepositoryPackageManager } from "@packages/package-manager";
import { getProjectAbsolutePath } from "@packages/paths";
import { DependenciesMap, ParsedPackageLock } from "./types";
import { getConfigFileData } from "./getConfigFileData";
import { mapPackageJsonDependencies } from "./mapPackageJsonDependencies";

type IterateOverPackageJsonsArgs = {
  packageJsonPaths: string[];
};

export const iterateOverPackageJsons = ({ packageJsonPaths }: IterateOverPackageJsonsArgs) => {
  const projectAbsolutePath = getProjectAbsolutePath();
  const config = getConfigFileData({ projectAbsolutePath });
  const { packageIdentifiers } = config;
  const { lock } = detectRepositoryPackageManager();
  const lockFile = getFile({ path: `${projectAbsolutePath}/${lock}` });
  const parsedLockFile = (lockFile ? JSON.parse(lockFile) : { packages: {} }) as ParsedPackageLock;
  const dependenciesMap: DependenciesMap = {};

  packageJsonPaths.forEach((packageJsonPath) => {
    mapPackageJsonDependencies({
      fullPathWithFile: packageJsonPath,
      dependenciesMap,
      parsedLockFile,
      packageIdentifiers,
    });
  });

  return dependenciesMap;
};
