import { fillDependenciesMap } from "./fillDependenciesMap";
import { type DependenciesMap } from "@packages/detect-repository-dependencies-types";
import { type PackageJsonDependencyTypesArray, type ParsedPackageLock } from "./types";
import { getFile } from "@packages/files";
import { detectRepositoryPackageManager } from "@packages/package-manager";
import { getDependencyTypesArray } from "./getDependencyTypesArray";

type MapPackageJsonDependenciesArgs = {
  packageJsonPaths: string[];
  projectAbsolutePath: string;
  packageIdentifiers?: string[];
  includePackageJsonDependencyTypesArrays?: boolean;
};

export const mapPackageJsonDependencies = ({
  packageJsonPaths,
  projectAbsolutePath,
  packageIdentifiers,
  includePackageJsonDependencyTypesArrays,
}: MapPackageJsonDependenciesArgs) => {
  const { lock } = detectRepositoryPackageManager();
  const lockFile = getFile({ path: `${projectAbsolutePath}/${lock}` });
  // TODO: Add methods for yarn and pnpm.
  const parsedLockFile = (lockFile ? JSON.parse(lockFile) : { packages: {} }) as ParsedPackageLock;
  const dependenciesMap: DependenciesMap = {};
  const packageJsonDependencyTypesArrays: PackageJsonDependencyTypesArray[] = [];

  packageJsonPaths.forEach((packageJsonPath) => {
    recursiveDependencyMapping({
      path: packageJsonPath,
      dependenciesMap,
      parsedLockFile,
      packageIdentifiers,
      includePackageJsonDependencyTypesArrays,
      packageJsonDependencyTypesArrays,
    });
  });

  return { dependenciesMap, parsedLockFile, packageJsonDependencyTypesArrays };
};

type RecursiveDependencyMappingArgs = {
  path: string;
  dependenciesMap: DependenciesMap;
  parsedLockFile: ParsedPackageLock;
  packageIdentifiers?: string[];
  includePackageJsonDependencyTypesArrays?: boolean;
  packageJsonDependencyTypesArrays: PackageJsonDependencyTypesArray[];
};

const recursiveDependencyMapping = ({
  path,
  dependenciesMap,
  parsedLockFile,
  packageIdentifiers,
  includePackageJsonDependencyTypesArrays,
  packageJsonDependencyTypesArrays,
}: RecursiveDependencyMappingArgs) => {
  const { name, dependencyTypesArray } = getDependencyTypesArray({ path });

  if (!dependencyTypesArray) {
    return;
  }

  if (includePackageJsonDependencyTypesArrays) {
    packageJsonDependencyTypesArrays.push({ name, dependencyTypesArray });
  }

  dependencyTypesArray.forEach((current) => {
    const { dependencyType, data } = current;

    fillDependenciesMap({
      name,
      fullPathWithFile: path,
      dependencies: data,
      dependencyType,
      dependenciesMap,
      parsedLockFile,
      packageIdentifiers,
    });
  });
};
