import { readFileSync, writeFileSync } from "fs";
import { GithubActionYaml } from "./types";
import { convertObjectToYaml } from "@packages/yaml";

type ParseGithubActionContentArgs = {
  filePath: string;
  projectCompleteRootAbsolutePath: string;
  onPushCallback?: (args: { onPush: Record<string, string[]> }) => void;
  stepCallbacks?: Record<string, (args: { step: Record<string, string> }) => void>;
};

export const parseGithubActionContent = ({
  filePath,
  projectCompleteRootAbsolutePath,
  onPushCallback,
  stepCallbacks = {},
}: ParseGithubActionContentArgs) => {
  const config = readFileSync(filePath, { encoding: "utf-8" });

  const parsedConfig = JSON.parse(config);
  for (const fileName in parsedConfig) {
    const { name, env, on, jobs } = parsedConfig[fileName] as Omit<GithubActionYaml, "fileName"> & {
      dependencies: {
        step: string;
      };
    };

    const { push } = on;
    if (push && onPushCallback) {
      onPushCallback({ onPush: on.push as Record<string, string[]> });
    }

    on.workflow_dispatch = "";

    for (const job in jobs) {
      const { steps = [] } = jobs[job];
      (steps as Record<string, string>[]).forEach((step, index) => {
        const { name, run } = step;
        const stepCallback = stepCallbacks[name];
        stepCallback?.({ step });
        if (Array.isArray(run)) {
          parsedConfig[fileName].jobs[job].steps[index].run = run.join("\n");
        }
      });
    }

    const githubActionYaml: GithubActionYaml = {
      name,
      env,
      on,
      jobs,
    };

    const yamlFormat = convertObjectToYaml({ obj: githubActionYaml });

    writeFileSync(
      `${projectCompleteRootAbsolutePath}/.github/workflows/${fileName}.yaml`,
      yamlFormat,
    );
  }
};
