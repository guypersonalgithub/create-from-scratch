import { readFileSync, readdirSync, writeFileSync } from "fs";
import { GithubActionYaml } from "./types";
import { getProjectAbsolutePath } from "@packages/paths";
import { detectUsedLocalPackages } from "@packages/packages";
import { convertObjectToYaml } from "@packages/yaml";

export const generateGithubActionYaml = async () => {
  console.log("Generating new github action yaml files");

  const projectAbsolutePath = getProjectAbsolutePath();
  const folderPath = `${projectAbsolutePath}/apps`;
  const workspaces = readdirSync(folderPath);

  workspaces.forEach((workspace) => {
    try {
      const workspacePackages = detectUsedLocalPackages({
        workspace: `apps/${workspace}`,
        projectAbsolutePath,
        fileName: "package.json",
      });

      const config = readFileSync(
        `${projectAbsolutePath}/apps/${workspace}/github.cicd.config.json`,
        {
          encoding: "utf-8",
        },
      );

      const parsedConfig = JSON.parse(config);
      for (const fileName in parsedConfig) {
        const {
          name,
          env,
          on,
          jobs,
          dependencies: { step: dependenciesStep },
        } = parsedConfig[fileName] as Omit<GithubActionYaml, "fileName"> & {
          dependencies: {
            step: string;
          };
        };

        const { push } = on;
        if (push) {
          (on.push as Record<string, string[]>).paths = [
            "apps/remix/**",
            ...workspacePackages.map((workspacePackage) => {
              return `${workspacePackage.path}/**`;
            }),
          ];
        }

        on.workflow_dispatch = "";

        for (const job in jobs) {
          const { steps = [] } = jobs[job];
          (steps as Record<string, string>[]).forEach((step, index) => {
            const { name, run } = step;
            if (!run || !Array.isArray(run)) {
              return;
            }

            if (name === dependenciesStep) {
              workspacePackages.forEach((workspacePackage) => {
                run.push(`cp -r ./${workspacePackage.path} ./full-application/packages`);
              });
            }

            parsedConfig[fileName].jobs[job].steps[index].run = run.join("\n");
          });
        }

        const githubActionYaml: GithubActionYaml = {
          name,
          env,
          on,
          jobs,
        };

        const yamlFormat = convertObjectToYaml({ obj: githubActionYaml });
        writeFileSync(`${projectAbsolutePath}/.github/workflows/${fileName}.yaml`, yamlFormat);
      }
    } catch (error) {}
  });
};
