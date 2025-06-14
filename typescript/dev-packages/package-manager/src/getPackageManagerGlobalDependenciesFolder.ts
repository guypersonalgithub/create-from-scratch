import { detectRepositoryPackageManager } from "./detectRepositoryPackageManager";
import { type SupportedPackageManagers } from "./types";

type GetPackageManagerGlobalDependenciesFolderArgs = {
  packageManager: SupportedPackageManagers;
};

const commandPerPackageManager: Record<SupportedPackageManagers, string> = {
  npm: "npm root -g",
  yarn: "yarn global dir",
  pnpm: "pnpm root -g",
};

export const getPackageManagerGlobalDependenciesFolder = (
  { packageManager }: GetPackageManagerGlobalDependenciesFolderArgs = {
    packageManager: detectRepositoryPackageManager().manager,
  },
) => {
  return commandPerPackageManager[packageManager] || commandPerPackageManager.npm;
};
