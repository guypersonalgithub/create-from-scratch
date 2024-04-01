import { readFileSync } from "fs";
import { getPrivatePackageDependencies } from "../utils/getPrivatePackageDependencies";

type detectWorkspacePackagesArgs = {
  workspace?: string;
  existingPrivatePackages?: string[];
  projectAbsolutePath: string;
  fileName?: string;
};

export const detectWorkspacePackages = ({
  workspace,
  existingPrivatePackages = [],
  projectAbsolutePath,
  fileName = "package.json",
}: detectWorkspacePackagesArgs) => {
  const file = readFileSync(`${projectAbsolutePath}/${workspace}/${fileName}`, {
    encoding: "utf-8",
    flag: "r",
  });

  const parsedFile = JSON.parse(file);

  const localPackage = "@packages";
  const privatePackages: string[] = existingPrivatePackages;
  const { dependencies, devDependencies } = parsedFile;

  getPrivatePackageDependencies({
    dependencies,
    privatePackages,
    localPackage,
    projectAbsolutePath,
  });
  getPrivatePackageDependencies({
    dependencies: devDependencies,
    privatePackages,
    localPackage,
    projectAbsolutePath,
  });

  return privatePackages;
};
