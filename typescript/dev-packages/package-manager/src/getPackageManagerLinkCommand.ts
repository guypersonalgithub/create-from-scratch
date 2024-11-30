import { detectRepositoryPackageManager } from "./detectRepositoryPackageManager";
import { SupportedPackageManagers } from "./types";

type GetPackageManagerLinkCommandArgs = {
  packageManager: SupportedPackageManagers;
};

export const getPackageManagerLinkCommand = (
  { packageManager }: GetPackageManagerLinkCommandArgs = {
    packageManager: detectRepositoryPackageManager().manager,
  },
) => {
  return `${packageManager} link`;
};
