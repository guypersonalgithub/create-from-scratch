import { readFileSync } from "fs";
import { WorkspaceContainerProperties } from "./types";

type GetContainerPropertiesArgs = {
  folderPath: string;
  workspace: string;
};

export const getContainerProperties = ({ folderPath, workspace }: GetContainerPropertiesArgs) => {
  try {
    const workspaceContainerProperties = readFileSync(
      `${folderPath}/${workspace}/containerProperties.json`,
      {
        encoding: "utf-8",
        flag: "r",
      },
    );

    return JSON.parse(workspaceContainerProperties) as WorkspaceContainerProperties;
  } catch (error) {
    // console.error(error);
  }
};
