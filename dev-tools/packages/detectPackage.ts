import { existsSync } from "fs";
import { getProjectAbsolutePath } from "../paths";
import { generatePackage } from "./generatePackage";

type DetectPackageArgs = {
  packageName: string;
};

export const detectPackage = ({ packageName }: DetectPackageArgs) => {
  const absolutePath = getProjectAbsolutePath();
  const packagesFolder = `${absolutePath}/packages`;
  const doesPackageAlreadyExist = existsSync(`${packagesFolder}/${packageName}`);

  if (doesPackageAlreadyExist) {
    return;
  }

  generatePackage({ packageName, folder: "packages" });
};
