import { readFileSync } from "fs";
import { getProjectAbsolutePath } from "../";

export const getAvailableDockerProfiles = () => {
  const projectAbsolutePath = getProjectAbsolutePath();
  const profiles = readFileSync(`${projectAbsolutePath}/profiles.json`, {
    encoding: "utf-8",
    flag: "r",
  });

  return JSON.parse(profiles) as string[];
};
