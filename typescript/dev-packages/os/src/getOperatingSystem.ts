import { platform } from "os";

export const mainOperatingSystems = {
  win32: "windows",
  linux: "linux",
  drawin: "mac",
};

export const getOperatingSystem =
  (): (typeof mainOperatingSystems)[keyof typeof mainOperatingSystems] => {
    const os = platform();

    return mainOperatingSystems[os as keyof typeof mainOperatingSystems];
  };
