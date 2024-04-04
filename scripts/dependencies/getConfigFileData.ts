import { readFileSync } from "fs";
import { ConfigProperties } from "./types";

type GetConfigFileDataArgs = {
  absolutePath: string;
};

export const getConfigFileData = ({ absolutePath }: GetConfigFileDataArgs) => {
  try {
    const configurationFile = readFileSync(
      `${absolutePath}/dependencies.config.json`,
      {
        encoding: "utf-8",
      }
    );
    const parsedConfigFile = JSON.parse(configurationFile);
    return parsedConfigFile as ConfigProperties;
  } catch (error) {
    return {};
  }
};
