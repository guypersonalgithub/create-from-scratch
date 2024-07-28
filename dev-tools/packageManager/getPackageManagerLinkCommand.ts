import { detectRepositoryPackageManager } from "./detectRepositoryPackageManager";
import { SupportedPackageManagers } from "./types";

type GetPackageManagerLinkCommandArgs = {
  packageManager: SupportedPackageManagers;
};

export const getPackageManagerLinkCommand = (args?: GetPackageManagerLinkCommandArgs) => {
  const { packageManager } = args ?? { packageManager: detectRepositoryPackageManager() };
  return `${packageManager} link`;
};
