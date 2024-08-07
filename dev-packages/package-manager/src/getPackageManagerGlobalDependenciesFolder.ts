import { detectRepositoryPackageManager } from "./detectRepositoryPackageManager";
import { SupportedPackageManagers } from "./types";

type GetPackageManagerGlobalDependenciesFolderArgs = {
  packageManager: SupportedPackageManagers;
};

const commandPerPackageManager: Record<SupportedPackageManagers, string> = {
  npm: "npm root -g",
  yarn: "yarn global dir",
  pnpm: "pnpm root -g",
};

export const getPackageManagerGlobalDependenciesFolder = (
  args?: GetPackageManagerGlobalDependenciesFolderArgs,
) => {
  const { packageManager } = args ?? { packageManager: detectRepositoryPackageManager().manager };

  return commandPerPackageManager[packageManager] || commandPerPackageManager.npm;
};
