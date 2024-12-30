import { readFileSync, writeFileSync } from "fs";
import { GithubActionYaml } from "./types";
import { convertObjectToYaml } from "@packages/yaml";

type ParseGithubActionContentArgs = {
  filePath: string;
  projectCompleteRootAbsolutePath: string;
  onPushCallback?: (args: { onPush: Record<string, string[]> }) => void;
  stepCallbacks?: Record<string, (args: { step: Record<string, string | Record<string, string>> }) => void>;
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
    const {
      name,
      description,
      inputs = {},
      outputs = {},
      env = {},
      on = {},
      permissions = {},
      jobs,
    } = parsedConfig[fileName] as Omit<GithubActionYaml, "fileName"> & {
      dependencies: {
        step: string;
      };
    };

    const hasNoOnProperties = Object.keys(on).length === 0;

    const { push } = on;
    if (push && onPushCallback) {
      onPushCallback({ onPush: on.push as Record<string, string[]> });
    }

    if (!hasNoOnProperties) {
      on.workflow_dispatch = "";
    }

    for (const job in jobs) {
      const { steps = [] } = jobs[job];
      (steps as Record<string, string | Record<string, string>>[]).forEach((step, index) => {
        const { name, run } = step;
        if (typeof name !== "string") {
          return;
        }

        const stepCallback = stepCallbacks[name];
        stepCallback?.({ step });
        if (Array.isArray(run)) {
          parsedConfig[fileName].jobs[job].steps[index].run = run.join("\n");
        }
      });
    }

    const githubActionYaml: GithubActionYaml = {
      name,
      description,
      inputs,
      outputs,
      env,
      on,
      permissions,
      jobs,
    };

    if (!description) {
      delete githubActionYaml.description;
    }

    if (Object.keys(inputs).length === 0) {
      delete githubActionYaml.inputs;
    }

    if (Object.keys(outputs).length === 0) {
      delete githubActionYaml.outputs;
    }

    if (Object.keys(env).length === 0) {
      delete githubActionYaml.env;
    }

    if (hasNoOnProperties) {
      delete githubActionYaml.on;
    }

    if (Object.keys(permissions).length === 0) {
      delete githubActionYaml.permissions;
    }

    const yamlFormat = convertObjectToYaml({ obj: githubActionYaml });

    writeFileSync(
      `${projectCompleteRootAbsolutePath}/.github/workflows/${fileName}.yaml`,
      yamlFormat,
    );
  }
};
