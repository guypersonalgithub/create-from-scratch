import { existsSync } from "fs";
import { getGlobalDependenciesFolderPath } from "@packages/global-dependencies";
import { join } from "path";

type CliAlreadyInstalledArgs = {
  cliName: string;
};

export const cliAlreadyInstalled = async ({ cliName }: CliAlreadyInstalledArgs) => {
  const globalDependenciesFolderPath = await getGlobalDependenciesFolderPath();
  const cliPath = join(globalDependenciesFolderPath ?? "", cliName);
  const isAlreadyInstalled = existsSync(cliPath);

  return isAlreadyInstalled;
};
