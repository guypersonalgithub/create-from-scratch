import { cliAlreadyInstalled, executeTerminalCommand, getOperatingSystem } from "../devTools";

const installAutoGenerateIfNotAlreadyInstalled = async () => {
  const isAlreadyInstalled = await cliAlreadyInstalled({ cliName: "custom-clis" });
  if (isAlreadyInstalled) {
    return;
  }

  const operatingSystem = getOperatingSystem();
  const baseCommand = "npm install -g ./clis";

  if (operatingSystem === "windows") {
    executeTerminalCommand({ command: baseCommand });
  } else {
    executeTerminalCommand({ command: `sudo ${baseCommand}` });
  }
};

installAutoGenerateIfNotAlreadyInstalled();
