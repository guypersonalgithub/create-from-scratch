import { detectRepositoryPackageManager } from "./detectRepositoryPackageManager";
import { SupportedPackageManagers } from "./types";

type GetPackageManagerInstallCommandArgs = {
  packageManager: SupportedPackageManagers;
};

export const getPackageManagerInstallCommand = (
  { packageManager }: GetPackageManagerInstallCommandArgs = {
    packageManager: detectRepositoryPackageManager().manager,
  },
) => {
  return `${packageManager} install`;
};
