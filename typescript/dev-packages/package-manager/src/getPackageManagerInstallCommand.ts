import { detectRepositoryPackageManager } from "./detectRepositoryPackageManager";
import { SupportedPackageManagers } from "./types";

type GetPackageManagerInstallCommandArgs = {
  packageManager: SupportedPackageManagers;
};

export const getPackageManagerInstallCommand = (args?: GetPackageManagerInstallCommandArgs) => {
  const { packageManager } = args ?? { packageManager: detectRepositoryPackageManager().manager };
  return `${packageManager} install`;
};
