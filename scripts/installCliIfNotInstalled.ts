import {
  cliAlreadyInstalled,
  executeTerminalCommand,
  getOperatingSystem,
  getPackageManagerLinkCommand,
} from "../dev-tools";

const installAutoGenerateIfNotAlreadyInstalled = async () => {
  const isAlreadyInstalled = await cliAlreadyInstalled({ cliName: "custom-clis" });
  if (isAlreadyInstalled) {
    return;
  }

  const operatingSystem = getOperatingSystem();
  const linkCommand = getPackageManagerLinkCommand();
  const baseCommand = `${linkCommand} ./clis`;

  if (operatingSystem === "windows") {
    executeTerminalCommand({ command: baseCommand });
  } else {
    executeTerminalCommand({ command: `sudo ${baseCommand}` });
  }
};

installAutoGenerateIfNotAlreadyInstalled();
