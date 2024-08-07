import { getPackageManagerGlobalDependenciesFolder } from "@packages/package-manager";
import { executeTerminalCommandWithResponse } from "../terminal";

export const getGlobalDependenciesFolderPath = async () => {
  const command = getPackageManagerGlobalDependenciesFolder();
  const globalDependenciesFolderPath = await executeTerminalCommandWithResponse({
    command,
  });

  return globalDependenciesFolderPath?.split("\n").join("").split("\r").join("");
};
