import { readdirSync } from "fs";
import { getProjectAbsolutePath, completeRootAbsolutePath } from "@packages/paths";
import { detectUsedLocalPackages } from "@packages/packages";
import { parseGithubActionContent } from "./parseGithubActionContent";

type GenerateGithubActionYamlArgs = {
  folders?: string[];
  uniqueFolders?: string[];
  configFileNameIdentifier?: string;
};

export const generateGithubActionYaml = ({
  folders = ["apps"],
  uniqueFolders = [],
  configFileNameIdentifier = "yaml.config.ts",
}: GenerateGithubActionYamlArgs) => {
  console.log("Generating new github action yaml files");

  const projectAbsolutePath = getProjectAbsolutePath();
  const projectCompleteRootAbsolutePath = completeRootAbsolutePath();
  folders.forEach((folder) => {
    const folderPath = `${projectAbsolutePath}/${folder}`;
    const workspaces = readdirSync(folderPath, { withFileTypes: true });

    workspaces.forEach((workspace) => {
      if (!workspace.isDirectory()) {
        return;
      }

      const { name } = workspace;

      try {
        const path = `${folder}/${name}`;

        const workspacePackages = detectUsedLocalPackages({
          workspace: path,
          projectAbsolutePath,
          fileName: "package.json",
        });

        const files = readdirSync(path);
        files.forEach((file) => {
          try {
            if (!file.endsWith(configFileNameIdentifier)) {
              return;
            }

            parseGithubActionContent({
              file,
              folderPath: `${projectAbsolutePath}/${path}`,
              projectCompleteRootAbsolutePath,
              onPushCallback: ({ onPush }) => {
                onPush.paths = [
                  `typescript/${folder}/${name}/**`, // Temporary solution - adding typescript as a prefix
                  ...workspacePackages.map((workspacePackage) => {
                    return `typescript/${workspacePackage.path}/**`;
                  }),
                ];
              },
              onPullRequest: ({ onPull }) => {
                onPull.paths = [
                  `typescript/${folder}/${name}/**`, // Temporary solution - adding typescript as a prefix
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
      } catch (error) {}
    });
  });

  uniqueFolders.forEach((uniqueFolder) => {
    const folderPath = `${projectAbsolutePath}/${uniqueFolder}`;
    const uniqueFiles = readdirSync(folderPath);

    uniqueFiles.forEach((file) => {
      try {
        if (!file.endsWith(configFileNameIdentifier)) {
          return;
        }

        parseGithubActionContent({
          file,
          folderPath: `${folderPath}`,
          projectCompleteRootAbsolutePath,
        });
      } catch (error) {}
    });
  });
};
