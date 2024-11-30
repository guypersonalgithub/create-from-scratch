import { detectRepositoryPackageManager } from "./detectRepositoryPackageManager";
import { SupportedPackageManagers } from "./types";

type GetPackageManagerProductionInstallCommandArgs = {
  packageManager: SupportedPackageManagers;
};

const commandPerPackageManager: Record<SupportedPackageManagers, string> = {
  npm: "npm ci --only=production",
  yarn: "yarn install --production",
  pnpm: "pnpm install --prod --frozen-lockfile",
};

export const getPackageManagerProductionInstallCommand = (
  { packageManager }: GetPackageManagerProductionInstallCommandArgs = {
    packageManager: detectRepositoryPackageManager().manager,
  },
) => {
  return commandPerPackageManager[packageManager] || commandPerPackageManager.npm;
};
