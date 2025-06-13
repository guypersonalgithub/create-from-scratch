import { detectRepositoryPackageManager } from "./detectRepositoryPackageManager";
import { type SupportedPackageManagers } from "./types";

type GetPackageManagerRunScriptCommandArgs = {
  packageManager: SupportedPackageManagers;
};

const commandPerPackageManager: Record<SupportedPackageManagers, string> = {
  npm: "npm run",
  yarn: "yarn",
  pnpm: "pnpm run",
};

export const getPackageManagerRunScriptCommand = (
  { packageManager }: GetPackageManagerRunScriptCommandArgs = {
    packageManager: detectRepositoryPackageManager().manager,
  },
) => {
  return commandPerPackageManager[packageManager] || commandPerPackageManager.npm;
};
