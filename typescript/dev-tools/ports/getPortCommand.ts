import { getOperatingSystem, mainOperatingSystems } from "../operatingSystem";

type GetPortCommandArgs = {
  port: number;
  operatingSystem?: (typeof mainOperatingSystems)[keyof typeof mainOperatingSystems];
};

export const getPortCommand = async ({
  port,
  operatingSystem = getOperatingSystem(),
}: GetPortCommandArgs) => {
  if (operatingSystem === mainOperatingSystems.win32) {
    return `netstat -ano | find "0.0.0.0:${port}"`;
  }

  return `lsof -i :${port}`;
};
