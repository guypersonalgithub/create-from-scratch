import { getOperatingSystem, mainOperatingSystems } from "../operatingSystem";
import { executeTerminalCommandWithResponse } from "../terminal";
import { getPortCommand } from "./getPortCommand";

type CheckPortAvailabilityArgs = {
  port: number;
  operatingSystem?: (typeof mainOperatingSystems)[keyof typeof mainOperatingSystems];
};

export const checkPortAvailability = async ({
  port,
  operatingSystem = getOperatingSystem(),
}: CheckPortAvailabilityArgs) => {
  try {
    const command = await getPortCommand({ port, operatingSystem });
    const response = await executeTerminalCommandWithResponse({ command });
    console.log(`port ${port} is already taken`);
    return response;
  } catch (error) {
    console.log(`port ${port} is available.`);
  }
};
