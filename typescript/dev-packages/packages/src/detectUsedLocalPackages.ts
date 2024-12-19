import { readFileSync } from "fs";
import { getPrivatePackageDependencies } from "./getPrivatePackageDependencies";
import { getRootPackageLock } from "./getRootPackageLock";
import { LocalPackageMetadata, PackageJsonDependencies, PackageLockPackages } from "./types";

type DetectUsedLocalPackagesArgs = {
  workspace?: string;
  includeOnly?: PackageJsonDependencies[];
  existingPrivatePackages?: Map<string, LocalPackageMetadata>;
  projectAbsolutePath: string;
  fileName?: string;
};

export const detectUsedLocalPackages = ({
  workspace,
  includeOnly,
  existingPrivatePackages,
  projectAbsolutePath,
  fileName,
}: DetectUsedLocalPackagesArgs) => {
  const parsedRootPackageLock = getRootPackageLock({ projectAbsolutePath });

  const usedLocalPackages =
    recursiveLocalPackagesDetection({
      workspace,
      includeOnly,
      existingPrivatePackages,
      projectAbsolutePath,
      fileName,
      parsedRootPackageLock: parsedRootPackageLock["packages"],
    }) ??
    new Map<
      string,
      {
        path: string;
        name: string;
      }
    >();

  const dependenciesArray = Array.from(usedLocalPackages.values());
  return dependenciesArray;
};

export const recursiveLocalPackagesDetection = ({
  workspace,
  includeOnly = ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"],
  existingPrivatePackages = new Map<
    string,
    {
      path: string;
      name: string;
    }
  >(),
  projectAbsolutePath,
  fileName = "package.json",
  parsedRootPackageLock,
}: DetectUsedLocalPackagesArgs & {
  parsedRootPackageLock: PackageLockPackages;
}) => {
  try {
    const file = readFileSync(`${projectAbsolutePath}/${workspace}/${fileName}`, {
      encoding: "utf-8",
      flag: "r",
    });

    const parsedFile = JSON.parse(file);

    const localPackage = "@packages";
    const privatePackages: Map<
      string,
      {
        path: string;
        name: string;
      }
    > = existingPrivatePackages;

    const dependenciesToIterateOver: Record<string, string>[] = includeOnly
      .map((included) => {
        return parsedFile[included];
      })
      .filter(Boolean);

    dependenciesToIterateOver.forEach((dependencies) => {
      getPrivatePackageDependencies({
        dependencies,
        privatePackages,
        localPackage,
        projectAbsolutePath,
        parsedRootPackageLock,
      });
    });

    return privatePackages;
  } catch (error) {
    console.error(error);
  }
};
