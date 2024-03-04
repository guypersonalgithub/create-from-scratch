import fs from "fs";
import { getCommandFlags } from "./getCommandFlags";
import { getPrivatePackageDependencies } from "./getPrivatePackageDependencies";

type detectPackagesArgs = {
  workspace?: string;
  existingPrivatePackages?: string[];
};

export const detectPackages = ({
  workspace,
  existingPrivatePackages = [],
}: detectPackagesArgs) => {
  let workSpace;

  if (!workspace) {
    const flagMap = getCommandFlags();
    workSpace = flagMap.get("workspace");
  } else {
    workSpace = workspace;
  }

  const file = fs.readFileSync(`${workSpace}/package.json`, {
    encoding: "utf8",
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
  });
  getPrivatePackageDependencies({
    dependencies: devDependencies,
    privatePackages,
    localPackage,
  });

  return privatePackages;
};
