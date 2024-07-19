import { getOperatingSystem, mainOperatingSystems } from "../operatingSystem";
import { checkPortAvailability } from "./checkPortAvailability";

type FindAvailablePortInRangeArgs = {
  startPort: number;
  endPort: number;
  operatingSystem?: (typeof mainOperatingSystems)[keyof typeof mainOperatingSystems];
};

export const findAvailablePortInRange = async ({
  startPort,
  endPort,
  operatingSystem = getOperatingSystem(),
}: FindAvailablePortInRangeArgs) => {

  for await (const port of Array.from(
    { length: endPort - startPort + 1 },
    (_, i) => startPort + i,
  )) {
    const isAvailable = await checkPortAvailability({ port, operatingSystem });
    if (!isAvailable) {
      return port;
    }
  }
  return null;
};
