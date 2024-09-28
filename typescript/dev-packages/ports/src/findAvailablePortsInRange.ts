import { getOperatingSystem, mainOperatingSystems } from "@packages/os";
import { checkPortAvailability } from "./checkPortAvailability";

type FindAvailablePortsInRangeArgs = {
  startPort: number;
  endPort: number;
  operatingSystem?: (typeof mainOperatingSystems)[keyof typeof mainOperatingSystems];
  amountOfPorts?: number;
};

export const findAvailablePortsInRange = async ({
  startPort,
  endPort,
  operatingSystem = getOperatingSystem(),
  amountOfPorts = 1,
}: FindAvailablePortsInRangeArgs) => {
  const availablePorts: number[] = [];

  for await (const port of Array.from(
    { length: endPort - startPort + 1 },
    (_, i) => startPort + i,
  )) {
    const isTaken = await checkPortAvailability({ port, operatingSystem });
    if (!isTaken) {
      availablePorts.push(port);

      if (availablePorts.length === amountOfPorts) {
        break;
      }
    }
  }

  return availablePorts;
};
