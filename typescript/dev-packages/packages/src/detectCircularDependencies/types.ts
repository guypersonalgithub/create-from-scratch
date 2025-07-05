import { type PackageLockPackages } from "../types";
import { type DependencyType } from "@packages/package-json";

export type DetectCircularDependenciesArgs = {
  dependencyTypes?: DependencyType[];
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
