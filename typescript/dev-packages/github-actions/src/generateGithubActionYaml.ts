import { readdirSync } from "fs";
import { getProjectAbsolutePath, completeRootAbsolutePath } from "@packages/paths";
import { detectUsedLocalPackages } from "@packages/packages";
import { parseGithubActionContent } from "./parseGithubActionContent";

type GenerateGithubActionYamlArgs = {
  folders?: string[];
  uniqueFolders?: string[];
};

export const generateGithubActionYaml = ({
  folders = ["apps"],
  uniqueFolders = [],
}: GenerateGithubActionYamlArgs) => {
  console.log("Generating new github action yaml files");

  const projectAbsolutePath = getProjectAbsolutePath();
  const projectCompleteRootAbsolutePath = completeRootAbsolutePath();
  folders.forEach((folder) => {
    const folderPath = `${projectAbsolutePath}/${folder}`;
    const workspaces = readdirSync(folderPath);

    workspaces.forEach((workspace) => {
      try {
        const workspacePackages = detectUsedLocalPackages({
          workspace: `${folder}/${workspace}`,
          projectAbsolutePath,
          fileName: "package.json",
        });

        parseGithubActionContent({
          filePath: `${projectAbsolutePath}/${folder}/${workspace}/github.cicd.config.json`,
          projectCompleteRootAbsolutePath,
          onPushCallback: ({ onPush }) => {
            onPush.paths = [
              `typescript/${folder}/${workspace}/**`, // Temporary solution - adding typescript as a prefix
              ...workspacePackages.map((workspacePackage) => {
                return `typescript/${workspacePackage.path}/**`;
              }),
            ];
          },
          stepCallbacks: {
            "Copy dependencies": ({ step }) => {
              const { name, run } = step;
              if (!run || !Array.isArray(run)) {
                return;
              }

              if (name === "Copy dependencies") {
                workspacePackages.forEach((workspacePackage) => {
                  run.push(`cp -r ./${workspacePackage.path} ./full-application/packages`);
                });
              }
            },
          },
        });
      } catch (error) {}
    });
  });

  uniqueFolders.forEach((uniqueFolder) => {
    const folderPath = `${projectAbsolutePath}/${uniqueFolder}`;
    const uniqueFiles = readdirSync(folderPath);

    uniqueFiles.forEach((uniqueFile) => {
      try {
        parseGithubActionContent({
          filePath: `${folderPath}/${uniqueFile}`,
          projectCompleteRootAbsolutePath,
        });
      } catch (error) {
      }
    });
  });
};
