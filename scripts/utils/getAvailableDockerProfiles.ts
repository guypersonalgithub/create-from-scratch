import fs from "fs";
import { getProjectAbsolutePath } from "./getProjectAbsolutePath";

export const getAvailableDockerProfiles = () => {
  const projectAbsolutePath = getProjectAbsolutePath();
  const profiles = fs.readFileSync(`${projectAbsolutePath}/profiles.json`, {
    encoding: "utf8",
    flag: "r",
  });

  return JSON.parse(profiles) as string[];
};
