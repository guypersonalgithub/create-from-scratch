import { readFileSync, readdirSync, writeFileSync } from "fs";
import { GithubActionYaml } from "./types";
import jsYaml from "js-yaml";
import { getProjectAbsolutePath } from "../utils";
import { detectWorkspacePackages } from "../packages";

export const generateGithubActionYaml = async () => {
  console.log("Generating new github action yaml files");

  const projectAbsolutePath = getProjectAbsolutePath();
  const folderPath = `${projectAbsolutePath}/apps`;
  const workspaces = readdirSync(folderPath);

  workspaces.forEach((workspace) => {
    try {
      const workspacePackages =
        detectWorkspacePackages({
          workspace: `apps/${workspace}`,
          projectAbsolutePath,
          fileName: "package.json",
        }) ?? [];

      const workspacePackagesArray = [...workspacePackages];

      const config = readFileSync(
        `${projectAbsolutePath}/apps/${workspace}/github.cicd.config.json`,
        {
          encoding: "utf-8",
        }
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
            ...workspacePackagesArray.map((workspacePackage) => {
              return `${workspacePackage}/**`;
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
              workspacePackagesArray.forEach((workspacePackage) => {
                run.push(
                  `cp -r ./${workspacePackage} ./full-application/packages`
                );
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

        const yamlFormat = jsYaml.dump(githubActionYaml);
        const fixedYamlFormat = fixJSYamlInconsistencies({ yamlFormat });
        writeFileSync(
          `${projectAbsolutePath}/.github/workflows/${fileName}.yaml`,
          fixedYamlFormat
        );
      }
    } catch (error) {}
  });
};

type FixJSYamlInconsistenciesArgs = {
  yamlFormat: string;
};

const fixJSYamlInconsistencies = ({
  yamlFormat,
}: FixJSYamlInconsistenciesArgs) => {
  const regexPattern = /\b(run:\s*\|-)/g;
  const fixedYamlFormat = yamlFormat.replace(regexPattern, "run: |");
  const regexPattern2 = /'/g;
  return fixedYamlFormat.replace(regexPattern2, "");
};
