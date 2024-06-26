import { executeTerminalCommandWithResponse } from "../terminal";

export const getGlobalDependenciesFolderPath = async () => {
  const globalDependenciesFolderPath = await executeTerminalCommandWithResponse({
    command: "npm root -g",
  });

  return globalDependenciesFolderPath?.split("\n").join("").split("\r").join("");
};
