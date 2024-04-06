import { readFileSync } from "fs";
import { WorkspaceContainerProperties } from ".";

type GetContainerPropertiesArgs = {
  folderPath: string;
  workspace: string;
};

export const getContainerProperties = ({
  folderPath,
  workspace,
}: GetContainerPropertiesArgs) => {
  const workspaceContainerProperties = readFileSync(
    `${folderPath}/${workspace}/containerProperties.json`,
    {
      encoding: "utf8",
      flag: "r",
    }
  );

  return JSON.parse(
    workspaceContainerProperties
  ) as WorkspaceContainerProperties;
};
