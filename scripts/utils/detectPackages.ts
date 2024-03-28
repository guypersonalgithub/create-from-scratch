import fs from "fs";
import { getPrivatePackageDependencies } from "./getPrivatePackageDependencies";

type detectPackagesArgs = {
  workspace?: string;
  existingPrivatePackages?: string[];
  projectAbsolutePath: string;
};

export const detectPackages = ({
  workspace,
  existingPrivatePackages = [],
  projectAbsolutePath,
}: detectPackagesArgs) => {
  const file = fs.readFileSync(
    `${projectAbsolutePath}/${workspace}/package.json`,
    {
      encoding: "utf-8",
      flag: "r",
    }
  );

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
