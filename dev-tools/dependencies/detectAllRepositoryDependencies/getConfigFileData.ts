import { readFileSync } from "fs";
import { ConfigProperties } from "./types";

type GetConfigFileDataArgs = {
  projectAbsolutePath: string;
};

export const getConfigFileData = ({ projectAbsolutePath }: GetConfigFileDataArgs) => {
  try {
    const configurationFile = readFileSync(`${projectAbsolutePath}/dependencies.config.json`, {
      encoding: "utf-8",
    });
    const parsedConfigFile = JSON.parse(configurationFile);
    return parsedConfigFile as ConfigProperties;
  } catch (error) {
    return {};
  }
};
