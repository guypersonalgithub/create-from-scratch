import { executeTerminalCommand } from "../terminal";
import { getOperatingSystem, mainOperatingSystems } from "../operatingSystem/getOperatingSystem";

type OpenBrowserTabArgs = {
  url: string;
  operatingSystem?: (typeof mainOperatingSystems)[keyof typeof mainOperatingSystems];
};

export const openBrowserTab = ({
  url,
  operatingSystem = getOperatingSystem(),
}: OpenBrowserTabArgs) => {
  if (operatingSystem === mainOperatingSystems.win32) {
    return executeTerminalCommand({ command: `start ${url}` });
  }

  if (operatingSystem === mainOperatingSystems.linux) {
    return executeTerminalCommand({ command: `xdg-open ${url}` });
  }

  return executeTerminalCommand({ command: `open ${url}` });
};
