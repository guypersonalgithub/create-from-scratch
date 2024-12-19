import { PackageJsonDependencies, PackageLockPackages } from "../types";

export type DetectCircularDependenciesArgs = {
  dependencyTypes?: PackageJsonDependencies[];
  localPackageFolders?: string[];
  localPackageIdentifier?: string;
  specificPackages?: string[];
  mapProblematicPackageImports?: boolean;
};

export type PackagesCircularDependenciesAdditionalArgs = {
  projectAbsolutePath: string;
  problematicPackagesPaths: string[];
  packageLockPackages: PackageLockPackages;
};
