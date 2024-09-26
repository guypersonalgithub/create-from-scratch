import { readFileSync } from "fs";
import { getPrivatePackageDependencies } from ".";

type DetectUsedLocalPackagesArgs = {
  workspace?: string;
  includeOnly?: (
    | "dependencies"
    | "devDependencies"
    | "peerDependencies"
    | "optionalDependencies"
  )[];
  existingPrivatePackages?: Map<
    string,
    {
      path: string;
      name: string;
    }
  >;
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
  const rootPackageLock = readFileSync(`${projectAbsolutePath}/package-lock.json`, {
    encoding: "utf-8",
    flag: "r",
  });

  const parsedRootPackageLock = JSON.parse(rootPackageLock);

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
  parsedRootPackageLock: Record<
    string,
    {
      resolved: string;
      link: boolean;
    }
  >;
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
