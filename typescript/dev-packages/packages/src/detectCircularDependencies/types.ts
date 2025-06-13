import { type PackageJsonDependencies, type PackageLockPackages } from "../types";

export type DetectCircularDependenciesArgs = {
  dependencyTypes?: PackageJsonDependencies[];
  localPackageFolders?: string[];
  localPackageIdentifier?: string;
  specificPackages?: string[];
  mapProblematicPackageImports?: boolean;
  hideLogs?: boolean;
  parsePaths?: boolean;
};

export type PackagesCircularDependenciesAdditionalArgs = {
  projectAbsolutePath: string;
  problematicPackagesPaths: string[];
  packageLockPackages: PackageLockPackages;
};
