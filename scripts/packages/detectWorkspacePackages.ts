import { readFileSync } from "fs";
import { getPrivatePackageDependencies } from "../utils";

type detectWorkspacePackagesArgs = {
  workspace?: string;
  existingPrivatePackages?: Set<string>;
  projectAbsolutePath: string;
  fileName?: string;
};

export const detectWorkspacePackages = ({
  workspace,
  existingPrivatePackages = new Set<string>(),
  projectAbsolutePath,
  fileName = "package.json",
}: detectWorkspacePackagesArgs) => {
  try {
    const file = readFileSync(
      `${projectAbsolutePath}/${workspace}/${fileName}`,
      {
        encoding: "utf-8",
        flag: "r",
      }
    );

    const parsedFile = JSON.parse(file);

    const localPackage = "@packages";
    const privatePackages: Set<string> = existingPrivatePackages;
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
  } catch (error) {
    console.error(error);
  }
};
