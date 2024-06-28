import { detectRepositoryPackageManager } from "./detectRepositoryPackageManager";
import { SupportedPackageManagers } from "./types";

type GetPackageManagerRunScriptCommandArgs = {
  packageManager: SupportedPackageManagers;
};

const commandPerPackageManager: Record<SupportedPackageManagers, string> = {
  npm: "npm run",
  yarn: "yarn",
  pnpm: "pnpm run",
};

export const getPackageManagerRunScriptCommand = (args?: GetPackageManagerRunScriptCommandArgs) => {
  const { packageManager } = args ?? { packageManager: detectRepositoryPackageManager() };

  return commandPerPackageManager[packageManager] || commandPerPackageManager.npm;
};
