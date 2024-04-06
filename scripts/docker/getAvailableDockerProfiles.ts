import { readFileSync } from "fs";
import { getProjectAbsolutePath } from "../utils/getProjectAbsolutePath";

export const getAvailableDockerProfiles = () => {
  const projectAbsolutePath = getProjectAbsolutePath();
  const profiles = readFileSync(`${projectAbsolutePath}/profiles.json`, {
    encoding: "utf8",
    flag: "r",
  });

  return JSON.parse(profiles) as string[];
};
