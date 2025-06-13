import { readdirSync, readFileSync } from "fs";
import {
  type DetectCircularDependenciesArgs,
  type PackagesCircularDependenciesAdditionalArgs,
} from "./types";

type CompletePackagesCircularDependenciesArgs = Omit<
  PackagesCircularDependenciesAdditionalArgs,
  "packageLockPackages"
> &
  DetectCircularDependenciesArgs;

export const completePackagesCircularDependencies = ({
  localPackageFolders = [],
  dependencyTypes = [],
  localPackageIdentifier = "",
  projectAbsolutePath,
  problematicPackagesPaths,
  hideLogs,
}: CompletePackagesCircularDependenciesArgs) => {
  const localPackageDependencies: Record<string, Record<string, string>[]> = {};

  localPackageFolders.forEach((folder) => {
    const localPackageFolders = readdirSync(folder);
    localPackageFolders.forEach((localPackageFolder) => {
      const fullPath = `${folder}/${localPackageFolder}`;

      try {
        const fullPackagePath = `${projectAbsolutePath}/${fullPath}/package.json`;
        const file = readFileSync(fullPackagePath, {
          encoding: "utf-8",
          flag: "r",
        });

        const parsedFile = JSON.parse(file);
        const packageName = parsedFile.name;

        const dependenciesToIterateOver: Record<string, string>[] = dependencyTypes
          .map((included) => {
            return parsedFile[included];
          })
          .filter(Boolean);

        localPackageDependencies[packageName] = dependenciesToIterateOver;
      } catch (error) {}
    });
  });

  for (const localPackage in localPackageDependencies) {
    const encounteredPackages = new Set<string>();

    try {
      recursiveLocalPackageDetection({
        localPackageDependencies,
        problematicPackagesPaths,
        localPackageIdentifier,
        packageName: localPackage,
        currentPath: localPackage,
        currentPackage: localPackage,
        encounteredPackages,
      });

      if (!hideLogs) {
        console.log(`Circular dependencies were not found for ${localPackage}`);
      }
    } catch (error) {}
  }
};

type RecursiveLocalPackageDetectionArgs = {
  localPackageDependencies: Record<string, Record<string, string>[]>;
  problematicPackagesPaths: string[];
  localPackageIdentifier: string;
  packageName: string;
  currentPath: string;
  currentPackage: string;
  encounteredPackages: Set<string>;
};

const recursiveLocalPackageDetection = ({
  localPackageDependencies,
  problematicPackagesPaths,
  localPackageIdentifier,
  packageName,
  currentPath,
  currentPackage,
  encounteredPackages,
}: RecursiveLocalPackageDetectionArgs) => {
  const dependencies = localPackageDependencies[currentPackage];
  dependencies.forEach((dependencyCategory) => {
    dependencyCategoryIteration({
      localPackageDependencies,
      problematicPackagesPaths,
      localPackageIdentifier,
      packageName,
      currentPath,
      dependencyCategory,
      encounteredPackages,
    });
  });
};

type DependencyCategoryIterationArgs = {
  dependencyCategory: Record<string, string>;
  encounteredPackages: Set<string>;
} & Omit<RecursiveLocalPackageDetectionArgs, "currentPackage">;

const dependencyCategoryIteration = ({
  localPackageDependencies,
  problematicPackagesPaths,
  localPackageIdentifier,
  packageName,
  currentPath,
  dependencyCategory,
  encounteredPackages,
}: DependencyCategoryIterationArgs) => {
  for (const dependency in dependencyCategory) {
    if (!dependency.includes(localPackageIdentifier)) {
      continue;
    }

    if (dependency === packageName) {
      problematicPackagesPaths.push(`${currentPath} -> ${dependency}`);
      throw new Error("Circular dependency detected!");
    }

    if (!encounteredPackages.has(dependency)) {
      encounteredPackages.add(dependency);
    } else {
      continue;
    }

    recursiveLocalPackageDetection({
      localPackageDependencies,
      problematicPackagesPaths,
      localPackageIdentifier,
      packageName,
      currentPath: `${currentPath} -> ${dependency}`,
      currentPackage: dependency,
      encounteredPackages,
    });
  }
};
