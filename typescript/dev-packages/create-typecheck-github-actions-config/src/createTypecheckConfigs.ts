import { getProjectAbsolutePath } from "@packages/paths";
import { readdirSync } from "fs";
import { createTypecheckGithubActionsConfig } from "./createTypecheckGithubActionsConfig";
import { addTypecheckScript } from "./addTypecheckScript";

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
      const folderName = innerFolder.name;

      addTypecheckScript({ folderPath: `${folderPath}/${folderName}` });

      createTypecheckGithubActionsConfig({
        folderName,
        folderPath,
        folder: `typescript/${folder}/${folderName}`,
      });
    });
  });
};
