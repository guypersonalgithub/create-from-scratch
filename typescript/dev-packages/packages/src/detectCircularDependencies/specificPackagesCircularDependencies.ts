import { existsSync, readFileSync } from "fs";
import {
  DetectCircularDependenciesArgs,
  PackagesCircularDependenciesAdditionalArgs,
} from "./types";
import { PackageLockPackages } from "../types";

type SpecificPackagesCircularDependenciesArgs = PackagesCircularDependenciesAdditionalArgs &
  DetectCircularDependenciesArgs;

export const specificPackagesCircularDependencies = ({
  localPackageFolders = [],
  dependencyTypes = [],
  localPackageIdentifier = "",
  specificPackages = [],
  projectAbsolutePath,
  problematicPackagesPaths,
  packageLockPackages,
}: SpecificPackagesCircularDependenciesArgs) => {
  try {
    specificPackages.forEach((specificPackage) => {
      const absolutePaths = localPackageFolders.map((folder) => {
        return `${projectAbsolutePath}/${folder}/${specificPackage}/package.json`;
      });

      const existingPath = absolutePaths.find((absolutePath) => {
        return existsSync(absolutePath);
      });

      if (!existingPath) {
        console.error(`Failed to find package ${specificPackage}`);
        return;
      }

      const startIndex = projectAbsolutePath.length;
      const endIndex = existingPath.length - "package.json".length;

      try {
        const encounteredPackages = new Set<string>();
        const packageDetails = {
          packageName: "",
        };

        recursiveLocalPackageDetection({
          projectAbsolutePath,
          localPackageFolder: existingPath.slice(startIndex, endIndex),
          dependencyTypes,
          localPackageIdentifier,
          packageLockPackages,
          problematicPackagesPaths,
          encounteredPackages,
          packageDetails,
        });

        console.log(`Circular dependencies were not found for ${packageDetails.packageName}`);
      } catch (error) {}
    });
  } catch (error) {
    console.error(error);
  }
};

type RecursiveLocalPackageDetectionArgs = {
  projectAbsolutePath: string;
  localPackageFolder: string;
  dependencyTypes: string[];
  localPackageIdentifier: string;
  packageLockPackages: PackageLockPackages;
  problematicPackagesPaths: string[];
  currentPath?: string;
  encounteredPackages: Set<string>;
  packageDetails: {
    packageName: string;
  };
};

const recursiveLocalPackageDetection = ({
  projectAbsolutePath,
  localPackageFolder,
  dependencyTypes,
  localPackageIdentifier,
  packageLockPackages,
  problematicPackagesPaths,
  currentPath,
  encounteredPackages,
  packageDetails,
}: RecursiveLocalPackageDetectionArgs) => {
  const file = readFileSync(`${projectAbsolutePath}/${localPackageFolder}/package.json`, {
    encoding: "utf-8",
    flag: "r",
  });

  const parsedFile = JSON.parse(file);

  if (!packageDetails.packageName) {
    packageDetails.packageName = parsedFile.name;
    currentPath = parsedFile.name;
  }

  const dependenciesToIterateOver: Record<string, string>[] = dependencyTypes
    .map((included) => {
      return parsedFile[included];
    })
    .filter(Boolean);

  dependenciesToIterateOver.forEach((dependencies) => {
    getLocalPackageDependencies({
      projectAbsolutePath,
      dependencies,
      dependencyTypes,
      localPackageIdentifier,
      packageLockPackages,
      problematicPackagesPaths,
      currentPath: currentPath as string,
      encounteredPackages,
      packageDetails,
    });
  });
};

type GetLocalPackageDependenciesArgs = {
  projectAbsolutePath: string;
  dependencies: Record<string, string>;
  dependencyTypes: string[];
  localPackageIdentifier: string;
  packageLockPackages: PackageLockPackages;
  problematicPackagesPaths: string[];
  currentPath: string;
  encounteredPackages: Set<string>;
  packageDetails: {
    packageName: string;
  };
};

const getLocalPackageDependencies = ({
  projectAbsolutePath,
  dependencies,
  dependencyTypes,
  localPackageIdentifier,
  packageLockPackages,
  problematicPackagesPaths,
  currentPath,
  encounteredPackages,
  packageDetails,
}: GetLocalPackageDependenciesArgs) => {
  for (const dependency in dependencies) {
    if (!dependency.includes(localPackageIdentifier)) {
      continue;
    }

    const nodeModulesLocalPackage = `node_modules/${dependency}`;
    const { resolved } = packageLockPackages[nodeModulesLocalPackage];

    if (dependency === packageDetails.packageName) {
      problematicPackagesPaths.push(`${currentPath} -> ${dependency}`);
      throw new Error("Circular dependency detected!");
    }

    if (!encounteredPackages.has(dependency)) {
      encounteredPackages.add(dependency);
    } else {
      continue;
    }

    recursiveLocalPackageDetection({
      projectAbsolutePath,
      localPackageFolder: resolved,
      dependencyTypes,
      localPackageIdentifier,
      packageLockPackages,
      problematicPackagesPaths,
      currentPath: `${currentPath} -> ${dependency}`,
      encounteredPackages,
      packageDetails,
    });
  }
};
