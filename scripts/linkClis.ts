import { cliAlreadyInstalled } from "../typescript/dev-packages/clis/src";
import { getOperatingSystem } from "../typescript/dev-packages/os/src";
import { executeTerminalCommand } from "../typescript/dev-packages/terminal-utils/src";
import { getPackageManagerLinkCommand } from "../typescript/dev-packages/package-manager/src";

type InstallAutoGenerateIfNotAlreadyInstalledArgs = {
  cliName: string;
};

const installAutoGenerateIfNotAlreadyInstalled = async ({
  cliName,
}: InstallAutoGenerateIfNotAlreadyInstalledArgs) => {
  const isAlreadyInstalled = await cliAlreadyInstalled({ cliName });
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

installAutoGenerateIfNotAlreadyInstalled({ cliName: "utils-cli" });
installAutoGenerateIfNotAlreadyInstalled({ cliName: "tests-cli" });
