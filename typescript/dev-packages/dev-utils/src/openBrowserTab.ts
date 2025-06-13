import { executeTerminalCommand } from "@packages/terminal-utils";
import { getOperatingSystem, mainOperatingSystems } from "@packages/os";

type OpenBrowserTabArgs = {
  url: string;
  operatingSystem?: (typeof mainOperatingSystems)[keyof typeof mainOperatingSystems];
};

export const openBrowserTab = ({
  url,
  operatingSystem = getOperatingSystem(),
}: OpenBrowserTabArgs) => {
  const command = getOpenBrowserTabCommand({ url, operatingSystem });

  return executeTerminalCommand({ command });
};

export const getOpenBrowserTabCommand = ({
  url,
  operatingSystem = getOperatingSystem(),
}: OpenBrowserTabArgs) => {
  if (operatingSystem === mainOperatingSystems.win32) {
    return `start ${url}`;
  }

  if (operatingSystem === mainOperatingSystems.linux) {
    return `xdg-open ${url}`;
  }

  return `open ${url}`;
};
