import { detectRepositoryPackageManager } from "./detectRepositoryPackageManager";
import { SupportedPackageManagers } from "./types";

type GetPackageManagerCreateLockfileOnlyCommandArgs = {
  packageManager: SupportedPackageManagers;
};

const commandPerPackageManager: Record<SupportedPackageManagers, string> = {
  npm: "npm install --package-lock-only --ignore-scripts",
  yarn: "yarn install --mode update-lockfile --ignore-scripts",
  pnpm: "pnpm install --lockfile-only --ignore-scripts",
};

export const getPackageManagerCreateLockfileOnlyCommand = (
  args?: GetPackageManagerCreateLockfileOnlyCommandArgs,
) => {
  const { packageManager } = args ?? { packageManager: detectRepositoryPackageManager().manager };

  return commandPerPackageManager[packageManager] || commandPerPackageManager.npm;
};
