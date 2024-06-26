import { platform } from "os";

const mainOperatingSystems = {
  win32: "windows",
  linux: "linux",
  drawin: "mac",
};

export const getOperatingSystem = () => {
  const os = platform();
  return mainOperatingSystems[os as keyof typeof mainOperatingSystems];
};
