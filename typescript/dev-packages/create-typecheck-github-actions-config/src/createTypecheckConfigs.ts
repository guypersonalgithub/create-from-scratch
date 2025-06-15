import { getProjectAbsolutePath } from "@packages/paths";
import { readdirSync } from "fs";
import { createTypecheckGithubActionsConfig } from "./createTypecheckGithubActionsConfig";

type CreateTypecheckConfigsArgs = {
  projectAbsolutePath?: string;
  folders: string[];
};

export const createTypecheckConfigs = ({
  projectAbsolutePath = getProjectAbsolutePath(),
  folders,
}: CreateTypecheckConfigsArgs) => {
  folders.forEach((folder) => {
    const folderPath = `${projectAbsolutePath}/${folder}`;
    let innerFolders = readdirSync(folderPath, { withFileTypes: true });

    if (folder === "clis") {
      innerFolders = innerFolders.filter((folder) => folder.name !== "utils");
    }

    innerFolders.forEach((innerFolder) => {
      createTypecheckGithubActionsConfig({
        folderName: innerFolder.name,
        folderPath,
        folder: `typescript/${folder}/${innerFolder.name}`,
      });
    });
  });
};
